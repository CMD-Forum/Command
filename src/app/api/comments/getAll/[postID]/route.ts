import { NextResponse } from "next/server";

import { getPostComments } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export type CommentAPIResponse = {
    user: {
        id: string;
        image: string | null;
        username: string;
    },
    id: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
    content: string,
    edited: boolean,
    postId: string,
    replyTo: string | null,
}[]

export async function GET(req: Request, { params }: { params: Promise<{ postID: string }> }) {
    try {
        const { postID } = await params;

        if (!postID) return NextResponse.json({ error: "postID is required." }, { status: 400 });

        const postComments = await getPostComments({ postID: postID });
              
        if (postComments.toString().length <= 0) {
            return new NextResponse(null, { status: 204 });
        } else {
            return NextResponse.json(postComments, { status: 200 })
        }
        
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ error: "Error occurred while getting comments." }, { status: 500 })
    }
}