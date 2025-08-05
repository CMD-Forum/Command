import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: Promise<{ postID: string }> }) {
    try {
        const { postID: POST_ID } = await params;
        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");

        if (!SESSION_ID) return new NextResponse(null, { status: 401 });

        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) return new NextResponse(null, { status: 401 });

        const POST_ALREADY_SAVED_REDIS = await redis.get(`users:${user.id}:saved-posts:${POST_ID}`);
        if (POST_ALREADY_SAVED_REDIS === "true") return NextResponse.json({ message: "Post is already saved." }, { status: 400 });

        const POST_ALREADY_SAVED = await db.savedPosts.findUnique({
            where: { postID_userID: { userID: user.id, postID: POST_ID } }
        });
        if (POST_ALREADY_SAVED) {
            await redis.set(`users:${user.id}:saved-posts:${POST_ID}`, "true");
            return NextResponse.json({ message: "Post is already saved." }, { status: 400 });
        }

        await db.savedPosts.create({
            data: {
                userID: user.id,
                postID: POST_ID
            }
        });
        await redis.set(`users:${user.id}:saved-posts:${POST_ID}`, "true");

        return NextResponse.json({ message: "Successfully saved post." }, { status: 201 });
    } catch (error) {
        log({ type: "error", message: error, scope: "API | savePost/[postID]/route.ts" });
        return NextResponse.json({ message: "Error occurred while saving post, please check your request for errors." }, { status: 500 });
    }
}