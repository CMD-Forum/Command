import { NextResponse } from "next/server";

import { getCommentReplies } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ commentID: string }> }) {
    try {
        const { commentID } = await params;

        if (!commentID) {
            return NextResponse.json({ message: "commentID is required." }, { status: 400 });
        }

        const replies = await getCommentReplies({ commentID: commentID });
              
        if (replies.toString().length <= 0) {
            return NextResponse.json({ status: 204 })
        } else {
            return NextResponse.json(replies, { status: 200 })
        }
        
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while getting replies."}, { status: 500 })
    }
}