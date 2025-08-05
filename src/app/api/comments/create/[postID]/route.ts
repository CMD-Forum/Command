import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { createComment, getComment } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: Promise<{ postID: string }> }) {
    try {
        const { postID } = await params;

        const authorizationHeader = req.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if (!sessionId) {
            return new NextResponse(null, {
                status: 401
            });
        }
        
        const { user } = await lucia.validateSession(sessionId);

        if (!user?.id) {
            return new NextResponse(null, {
                status: 401
            });
        }

        const { content, replyTo } = await req.json();
        if (!postID || !content) {
            return NextResponse.json({ message: "postID and content are required." }, { status: 400 });
        }

        const replyToComment = await getComment({ commentID: replyTo });

        if (replyTo && !replyToComment) {
            return NextResponse.json({ message: "Comment to reply to doesn't exist." }, { status: 400 })
        }

        if (replyTo && replyToComment && replyToComment.comment?.postId !== postID) {
            return NextResponse.json({ message: "Comment to reply to isn't on the same post." }, { status: 400 })
        }

        const comment = await createComment({ userID: user.id, postID: postID, content: content, replyTo: replyTo || null });
              
        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while creating comment."}, { status: 500 })
    }
}