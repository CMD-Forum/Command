import { NextResponse } from "next/server";

import { getTotalCommentDownvotes, getTotalCommentUpvotes } from "@/lib/data";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

export async function POST( req: Request ) {    
    try {
        const body = await req.json();
        const { commentID: COMMENT_ID } = body;
        
        if (!COMMENT_ID) { return NextResponse.json({ error: "commentID is required." }, { status: 400 })}

        const CACHED_UPVOTES = await redis.get(`comments:upvotes:${COMMENT_ID}`);
        const CACHED_DOWNVOTES = await redis.get(`comments:downvotes:${COMMENT_ID}`);

        if (!CACHED_UPVOTES || !CACHED_DOWNVOTES) {
            const UPVOTES = await getTotalCommentUpvotes({ commentID: COMMENT_ID });
            const DOWNVOTES = await getTotalCommentDownvotes({ commentID: COMMENT_ID });

            await redis.set(`comments:upvotes:${COMMENT_ID}`, UPVOTES.toString());
            await redis.expire(`comments:upvotes:${COMMENT_ID}`, 3600);

            await redis.set(`comments:downvotes:${COMMENT_ID}`, DOWNVOTES.toString());
            await redis.expire(`comments:downvotes:${COMMENT_ID}`, 3600);

            return NextResponse.json({ UPVOTES, DOWNVOTES }, { status: 200 })
        } else {
            const UPVOTES = CACHED_UPVOTES ? parseInt(CACHED_UPVOTES) : null;
            const DOWNVOTES = CACHED_DOWNVOTES ? parseInt(CACHED_DOWNVOTES) : null;

            return NextResponse.json({ upvotes: UPVOTES, downvotes: DOWNVOTES }, { status: 200 })
        }
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while fetching votes."}, { status: 500 })
    }
}