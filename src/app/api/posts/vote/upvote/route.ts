import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnPost, removePostDownvote, upvotePost } from "@/lib/data";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

export async function POST( req: Request ) {
    try {
        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");

        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })} 
        
        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) { return new NextResponse(null, { status: 401 })}

        const { postID: POST_ID } = await req.json();
        if (!POST_ID) { return NextResponse.json({ message: "userID and postID are required." }, { status: 400 })}

        const VOTED = await checkIfVotedOnPost({ userID: user.id, postID: POST_ID });

        if (VOTED.upvote === true) { return NextResponse.json({ message: "Already Upvoted"}, { status: 400 })}
        if (VOTED.downvote === true) { 
            await removePostDownvote({ userID: user.id, postID: POST_ID });
            await redis.decr(`posts:downvotes:${POST_ID}`);
        }

        const upvoted = await upvotePost({ userID: user.id, postID: POST_ID });
        await redis.incr(`posts:upvotes:${POST_ID}`);
              
        return NextResponse.json(upvoted, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while upvoting."}, { status: 500 })
    }
}