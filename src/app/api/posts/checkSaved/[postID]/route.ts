import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

async function authGET(req: Request, ctx: ContextWithAuth) {
    try {
        const { postID } = await ctx.params;

        if (!ctx.userId) { return new NextResponse(null, { status: 401 })}

        const POST_ALREADY_SAVED_REDIS = await redis.get(`users:${ctx.userId}:saved-posts:${postID}`);
        if (POST_ALREADY_SAVED_REDIS === "true") return NextResponse.json(true, { status: 200 });

        const SAVED = await db.savedPosts.findUnique({ where: { postID_userID: { userID: ctx.userId, postID: postID } } });
        if (SAVED) {
            await redis.set(`users:${ctx.userId}:saved-posts:${postID}`, "true");
            return NextResponse.json(true, { status: 200 })
        }
        
        return NextResponse.json(false, { status: 200 });
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred, please try again." }, { status: 500 });
    }
}

export const GET = withAuth(authGET, true)