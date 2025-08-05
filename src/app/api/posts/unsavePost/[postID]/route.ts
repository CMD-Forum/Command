import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { log } from "@/lib/utils";

export async function DELETE(req: Request, { params }: { params: Promise<{ postID: string }> }) {
    try {
        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");

        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })}
        
        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) { return new NextResponse(null, { status: 401 })}

        const { postID: POST_ID } = await params;
        const POST_ALREADY_SAVED = await db.savedPosts.findUnique({ where: { postID_userID: { userID: user.id, postID: POST_ID } } });

        if (POST_ALREADY_SAVED) {
            try {
                await db.savedPosts.delete({
                    where: {
                        postID_userID: {
                            userID: user.id,
                            postID: POST_ID
                        }
                    }
                });
                    
                await redis.set(`users:${user.id}:saved-posts:${POST_ID}`, "false");
                return NextResponse.json({ message: "Post was successfully unsaved." }, { status: 200 })
            } catch {
                return NextResponse.json({ message: "Sorry, an error occurred." }, { status: 500 })
            }
        }
        await redis.set(`users:${user.id}:saved-posts:${POST_ID}`, "false");
        return NextResponse.json({ message: "Post is not saved." }, { status: 400 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while unsaving post, please check your request for errors."}, { status: 500 });
    }
}
