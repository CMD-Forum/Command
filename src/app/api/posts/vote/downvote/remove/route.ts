import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { checkIfVotedOnPost, removePostDownvote } from "@/lib/data";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

async function authPOST(req: Request, ctx: ContextWithAuth) {
    try {
        const { postID: POST_ID } = await req.json();
        if (!POST_ID) return NextResponse.json({ message: "postID is required." }, { status: 400 });

        if (!ctx.userId) { return NextResponse.json({ message: "Authentication is required." }, { status: 401 })};

        const VOTED = await checkIfVotedOnPost({ userID: ctx.userId, postID: POST_ID });

        if (VOTED.downvote === true) {
            const REMOVED_DOWNVOTE = await removePostDownvote({ userID: ctx.userId, postID: POST_ID })
            .then(async () => {
                await redis.decr(`posts:downvotes:${POST_ID}`)    
            })
            return NextResponse.json(REMOVED_DOWNVOTE, { status: 200 });
        }
              
        return NextResponse.json({ error: "Post is not downvoted or an error occurred." }, { status: 400 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while downvoting."}, { status: 500 })
    }
}

export const POST = withAuth(authPOST, true)
