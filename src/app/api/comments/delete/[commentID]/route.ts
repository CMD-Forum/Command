import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { deleteComment, getComment } from "@/lib/data";
import { log } from "@/lib/utils";

export async function DELETE(req: Request, { params }: { params: Promise<{ commentID: string }> }) {
    try {

        const { commentID } = await params;
        if (!commentID) return NextResponse.json({ message: "commentID is required." }, { status: 400 });

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

        const { comment, error } = await getComment({ commentID: commentID });
        if (error) throw new Error(error);

        if (!comment || comment === null || comment === undefined) { return NextResponse.json({ message: "The selected comment does not exist." }, { status: 404 })}
        if (comment.content === "[deleted]") { return NextResponse.json({ message: "The selected comment is already deleted." }, { status: 400 })}

        if (!comment.user) { return NextResponse.json({ message: "This user does not have permission to delete this comment." }, { status: 403 })}
        if (comment.user.id !== user_id) { return NextResponse.json({ message: "This user does not have permission to delete this comment." }, { status: 403 })}

        const deletedComment = await deleteComment({ commentID: commentID });
              
        return NextResponse.json(deletedComment, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while deleting comment."}, { status: 500 })
    }
}