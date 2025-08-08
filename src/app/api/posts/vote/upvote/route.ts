import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { checkIfVotedOnPost, removePostDownvote, upvotePost } from "@/lib/data";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

async function authPOST(req: Request, ctx: ContextWithAuth) {
    try {
        const { postID: POST_ID } = await req.json();
        if (!POST_ID) { return NextResponse.json({ message: "postID is required." }, { status: 400 })};

        if (!ctx.userId) { return NextResponse.json({ message: "Authentication is required." }, { status: 401 })};

        const VOTED = await checkIfVotedOnPost({ userID: ctx.userId, postID: POST_ID });

        if (VOTED.upvote === true) { return NextResponse.json({ message: "Already Upvoted"}, { status: 400 })}
        if (VOTED.downvote === true) {
            await removePostDownvote({ userID: ctx.userId, postID: POST_ID })
            .then(async () => {
                await redis.decr(`posts:downvotes:${POST_ID}`);    
            })
        }

        const upvoted = await upvotePost({ userID: ctx.userId, postID: POST_ID })
        .then(async () => {
            await redis.incr(`posts:upvotes:${POST_ID}`);    
        })
              
        return NextResponse.json(upvoted, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while upvoting."}, { status: 500 })
    }
}

export const POST = withAuth(authPOST, true)