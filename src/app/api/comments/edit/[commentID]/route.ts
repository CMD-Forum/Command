import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { editComment, getComment } from "@/lib/data";
import { log } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: Promise<{ commentID: string }> }) {
    try {
        const { commentID } = await params;

        // Authetication

        const session = await auth.api.getSession({
            headers: req.headers
        });

        let user_id = session?.user.id;

        const { valid: API_KEY_VALID, key } = await auth.api.verifyApiKey({
            body: {
                key: req.headers.get("x-api-key") ?? "",
            },
        });

        if (!API_KEY_VALID && !session) return NextResponse.json({ message: "You must be logged in to delete a comment." }, { status: 401 });
        if (API_KEY_VALID && !session) user_id = key?.userId;

        // Main
        
        const { content } = await req.json();
        if (!commentID) {
            return NextResponse.json({ message: "commentID and content are required." }, { status: 400 });
        }

        const { comment, error } = await getComment({ commentID: commentID });

        if (error) throw new Error(error);

        if (!comment || comment === null || comment === undefined) return NextResponse.json({ message: "The selected comment does not exist." }, { status: 404 });
        if (comment.content === "[deleted]") return NextResponse.json({ message: "The selected comment is deleted." }, { status: 404 });

        if (!comment.user) return NextResponse.json({ message: "This user does not have permission to edit this comment." }, { status: 403 });
        if (comment.user.id !== user_id) return NextResponse.json({ message: "This user does not have permission to edit this comment." }, { status: 403 });

        const editedComment = await editComment({ commentID: commentID, content: content });
              
        return NextResponse.json(editedComment, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while editing comment."}, { status: 500 })
    }
}