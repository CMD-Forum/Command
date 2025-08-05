import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnPost, removePostUpvote } from "@/lib/data";
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

        if (VOTED.upvote === true) {
            const removedUpvote = await removePostUpvote({ userID: user.id, postID: POST_ID });
            await redis.decr(`posts:upvotes:${POST_ID}`);
            return NextResponse.json(removedUpvote, { status: 200 });
        }
        return NextResponse.json({ error: "Post is not upvoted or an error occurred." }, { status: 400 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while upvoting."}, { status: 500 })
    }
}