import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { log } from "@/lib/utils";

async function authPOST(req: Request, ctx: ContextWithAuth) {
    try {
        const body = await req.json();
        log({ message: "req: " + body.postID + "     ctx: " + ctx.userId, type: "info" })
        /*const { postID: POST_ID } = await req.json();
        if (!POST_ID) { return NextResponse.json({ error: "userID and postID are required." }, { status: 400 })}

        if (!ctx.userId) { return NextResponse.json({ message: "Authentication is required." }, { status: 401 })};

        const VOTED = await checkIfVotedOnPost({ userID: ctx.userId, postID: POST_ID });

        if (VOTED.downvote === true) { return NextResponse.json({ error: "Already Downvoted"}, { status: 400 })}
        if (VOTED.upvote === true) { 
            await removePostUpvote({ userID: ctx.userId, postID: POST_ID })
            .then(async () => {
                await redis.decr(`posts:upvotes:${POST_ID}`);    
            })
        }

        const DOWNVOTED = await downvotePost({ userID: ctx.userId, postID: POST_ID })
        .then(async () => {
            await redis.incr(`posts:downvotes:${POST_ID}`);
        })*/
              
        return NextResponse.json(/*DOWNVOTED*/ {}, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ error: "Error occurred while downvoting."}, { status: 500 })
    }
}

export const POST = withAuth(authPOST, true)