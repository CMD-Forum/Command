import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

async function authPOST(req: Request, ctx: ContextWithAuth) {
    try {
        const { postID: POST_ID } = await ctx.params;
        if (!ctx.userId) { return NextResponse.json({ message: "Authentication is required." }, { status: 401 })};

        const POST_ALREADY_SAVED_REDIS = await redis.get(`users:${ctx.userId}:saved-posts:${POST_ID}`);
        if (POST_ALREADY_SAVED_REDIS === "true") return NextResponse.json({ message: "Post is already saved." }, { status: 400 });

        const POST_ALREADY_SAVED = await db.savedPosts.findUnique({
            where: { postID_userID: { userID: ctx.userId, postID: POST_ID } }
        });
        if (POST_ALREADY_SAVED) {
            await redis.set(`users:${ctx.userId}:saved-posts:${POST_ID}`, "true");
            return NextResponse.json({ message: "Post is already saved." }, { status: 400 });
        }

        await db.savedPosts.create({
            data: {
                userID: ctx.userId,
                postID: POST_ID
            }
        });
        await redis.set(`users:${ctx.userId}:saved-posts:${POST_ID}`, "true");

        return NextResponse.json({ message: "Successfully saved post." }, { status: 201 });
    } catch (error) {
        log({ type: "error", message: error, scope: "API | savePost/[postID]/route.ts" });
        return NextResponse.json({ message: "Error occurred while saving post, please check your request for errors." }, { status: 500 });
    }
}

export const POST = withAuth(authPOST, true);