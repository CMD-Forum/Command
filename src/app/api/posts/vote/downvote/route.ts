import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnPost, downvotePost, removePostUpvote } from "@/lib/data";
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
        if (!POST_ID) { return NextResponse.json({ error: "userID and postID are required." }, { status: 400 })}

        const VOTED = await checkIfVotedOnPost({ userID: user.id, postID: POST_ID });

        if (VOTED.downvote === true) { return NextResponse.json({ error: "Already Downvoted"}, { status: 400 })}
        if (VOTED.upvote === true) { 
            await removePostUpvote({ userID: user.id, postID: POST_ID });
            await redis.decr(`posts:upvotes:${POST_ID}`);
        }

        const DOWNVOTED = await downvotePost({ userID: user.id, postID: POST_ID });
        await redis.incr(`posts:downvotes:${POST_ID}`);
              
        return NextResponse.json(DOWNVOTED, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ error: "Error occurred while downvoting."}, { status: 500 })
    }
}