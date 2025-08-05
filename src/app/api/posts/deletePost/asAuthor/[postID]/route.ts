import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { deletePostAsAuthor } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function DELETE(req: Request, { params }: { params: Promise<{ postID: string }> }) {
    try {
        const { postID: POST_ID } = await params;

        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");
        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })}
        
        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) { return new NextResponse(null, { status: 401 })}

        try {
            const deletedPost = await deletePostAsAuthor({ userID: user.id, postID: POST_ID });
            return NextResponse.json(deletedPost, { status: deletedPost?.status });
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
        
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while deleting post, please check your request for errors."}, { status: 500 });
    }
}
