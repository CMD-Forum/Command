import { NextResponse } from "next/server";

import { getTotalPostDownvotes, getTotalPostUpvotes } from "@/lib/data";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

export async function POST( req: Request ) {    
    try {
        const body = await req.json();
        const { postID: POST_ID } = body;
        
        if (!POST_ID) { return NextResponse.json({ message: "postID is required." }, { status: 400 })}

        const CACHED_UPVOTES = await redis.get(`posts:upvotes:${POST_ID}`);
        const CACHED_DOWNVOTES = await redis.get(`posts:downvotes:${POST_ID}`);

        if (!CACHED_UPVOTES || !CACHED_DOWNVOTES) {
            const UPVOTES = await getTotalPostUpvotes({ postID: POST_ID });
            const DOWNVOTES = await getTotalPostDownvotes({ postID: POST_ID });

            await redis.set(`posts:upvotes:${POST_ID}`, UPVOTES.toString());
            await redis.expire(`posts:upvotes:${POST_ID}`, 3600);

            await redis.set(`posts:downvotes:${POST_ID}`, DOWNVOTES.toString());
            await redis.expire(`posts:downvotes:${POST_ID}`, 3600);

            return NextResponse.json({ UPVOTES, DOWNVOTES }, { status: 200 })
        } else {
            const UPVOTES = CACHED_UPVOTES ? parseInt(CACHED_UPVOTES) : null;
            const DOWNVOTES = CACHED_DOWNVOTES ? parseInt(CACHED_DOWNVOTES) : null;

            return NextResponse.json({ upvotes: UPVOTES, downvotes: DOWNVOTES }, { status: 200 })
        }
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while fetching score."}, { status: 500 })
    }
}