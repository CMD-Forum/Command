import { NextResponse } from "next/server";

import { lucia } from "@/app/(general)/lib/auth";
import { deleteComment, getComment } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {

    try {

        const authorizationHeader = req.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if ( ! sessionId) {
            return NextResponse.json({ message: "This API requires a Session ID in the Authorization header." }, { status: 401 });
        }   
        
        const { user } = await lucia.validateSession(sessionId);

        if ( ! user?.id ) {
            return NextResponse.json({ message: "Session is invalid." }, { status: 401 });
        }

        const body = await req.json();
        let { commentID } = body;
        if ( ! commentID ) {
            return NextResponse.json({ message: "commentID is required." }, { status: 400 });
        }

        const comment = await getComment({ commentID: commentID });

        if ( ! comment || comment === null || comment === undefined ) {
            return NextResponse.json({ message: "The selected comment does not exist." }, { status: 404 });
        }

        // @ts-ignore
        if ( comment.content === "[deleted]" ) {
            return NextResponse.json({ message: "The selected comment is already deleted." }, { status: 404 });
        }

        // @ts-ignore
        if ( ! comment.user ) {
            return NextResponse.json({ message: "This user does not have permission to delete this comment." }, { status: 401 });
        }

        // @ts-ignore
        if ( comment.user.id !== user.id ) {
            return NextResponse.json({ message: "This user does not have permission to delete this comment." }, { status: 401 });
        }

        const deletedComment = await deleteComment({ commentID: commentID });
              
        return NextResponse.json(deletedComment, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while deleting comment."}, { status: 500 })
    }
}