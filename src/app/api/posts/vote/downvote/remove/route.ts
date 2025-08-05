import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnPost, removePostDownvote } from "@/lib/data";
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
        if (!POST_ID) return NextResponse.json({ message: "postID is required." }, { status: 400 });

        const VOTED = await checkIfVotedOnPost({ userID: user.id, postID: POST_ID });

        if (VOTED.downvote === true) {
            const REMOVED_DOWNVOTE = await removePostDownvote({ userID: user.id, postID: POST_ID });
            await redis.decr(`posts:downvotes:${POST_ID}`);
            return NextResponse.json(REMOVED_DOWNVOTE, { status: 200 });
        }
              
        return NextResponse.json({ error: "Post is not downvoted or an error occurred." }, { status: 400 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while downvoting."}, { status: 500 })
    }
}