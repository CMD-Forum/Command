import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnComment, removeCommentUpvote } from "@/lib/data";
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
        if (!COMMENT_ID) { return NextResponse.json({ error: "userID and commentID are required." }, { status: 400 })}

        const VOTED = await checkIfVotedOnComment({ userID: user.id, commentID: COMMENT_ID });

        if (VOTED.upvote === true) {
            const removedUpvote = await removeCommentUpvote({ userID: user.id, commentID: COMMENT_ID });
            await redis.decr(`comments:upvotes:${COMMENT_ID}`);
            return NextResponse.json(removedUpvote, { status: 200 });
        }
        return NextResponse.json({ error: "Comment is not upvoted or an error occurred." }, { status: 400 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ error: "Error occurred while upvoting."}, { status: 500 })
    }
}