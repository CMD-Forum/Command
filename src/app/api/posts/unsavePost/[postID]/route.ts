import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

async function authDELETE(req: Request, ctx: ContextWithAuth) {
    try {
        if (!ctx.userId) { return NextResponse.json({ message: "Authentication is required." }, { status: 401 })};
        
        const { postID: POST_ID } = await ctx.params;
        const POST_ALREADY_SAVED = await db.savedPosts.findUnique({ where: { postID_userID: { userID: ctx.userId, postID: POST_ID } } });

        if (POST_ALREADY_SAVED) {
            try {
                await db.savedPosts.delete({
                    where: {
                        postID_userID: {
                            userID: ctx.userId,
                            postID: POST_ID
                        }
                    }
                });
                    
                await redis.set(`users:${ctx.userId}:saved-posts:${POST_ID}`, "false");
                return NextResponse.json({ message: "Post was successfully unsaved." }, { status: 200 })
            } catch {
                return NextResponse.json({ message: "Sorry, an error occurred." }, { status: 500 })
            }
        }
        await redis.set(`users:${ctx.userId}:saved-posts:${POST_ID}`, "false");
        return NextResponse.json({ message: "Post is not saved." }, { status: 400 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while unsaving post, please check your request for errors."}, { status: 500 });
    }
}

export const DELETE = withAuth(authDELETE, true);