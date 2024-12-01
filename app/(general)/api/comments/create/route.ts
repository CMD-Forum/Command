import { NextResponse } from "next/server";

import { lucia } from "@/app/(general)/lib/auth";
import { createComment, getComment } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {

    try {
        const authorizationHeader = req.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if ( ! sessionId) {
            return new NextResponse(null, {
                status: 401
            });
        }   
        
        const { user } = await lucia.validateSession(sessionId);

        if ( ! user?.id ) {
            return new NextResponse(null, {
                status: 401
            });
        }

        const body = await req.json();
        let { postID, content, replyTo } = body;
        if ( ! postID || ! content ) {
            return NextResponse.json({ message: "postID and content are required." }, { status: 400 });
        }

        const replyToComment = await getComment({ commentID: replyTo });

        if ( replyTo && ! replyToComment ) {
            return NextResponse.json({ message: "Comment to reply to doesn't exist." }, { status: 400 })
        }

        // @ts-ignore
        if ( replyTo && replyToComment && replyToComment.postId !== postID ) {
            return NextResponse.json({ message: "Comment to reply to isn't on the same post." }, { status: 400 })
        }

        const comment = await createComment({ userID: user.id, postID: postID, content: content, replyTo: replyTo || null });
              
        return NextResponse.json(comment, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while creating comment."}, { status: 500 })
    }
}