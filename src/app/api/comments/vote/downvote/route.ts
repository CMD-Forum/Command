import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnComment, downvoteComment, removeCommentUpvote } from "@/lib/data";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

export async function POST( req: Request ) {
    try {
        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");
        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })}

        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) { return new NextResponse(null, { status: 401 })}

        const { commentID: COMMENT_ID } = await req.json();
        if (!COMMENT_ID) { return NextResponse.json({ message: "userID and commentID are required." }, { status: 400 })}

        const VOTED = await checkIfVotedOnComment({ userID: user.id, commentID: COMMENT_ID });

        if (VOTED.downvote === true) { return NextResponse.json({ message: "Already Downvoted" }, { status: 400 })}
        if (VOTED.upvote === true) { 
            await removeCommentUpvote({ userID: user.id, commentID: COMMENT_ID });
            await redis.decr(`comments:upvotes:${COMMENT_ID}`);
        }

        const DOWNVOTED = await downvoteComment({ userID: user.id, commentID: COMMENT_ID });
        await redis.incr(`comments:downvotes:${COMMENT_ID}`);
              
        return NextResponse.json(DOWNVOTED, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while downvoting."}, { status: 500 })
    }
}