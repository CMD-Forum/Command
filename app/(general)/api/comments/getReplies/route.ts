import { NextResponse } from "next/server";

import { getCommentReplies } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

// TO-DO: Add authentication

export async function POST( req: Request ) {

    try {
        const body = await req.json();
        let { commentID } = body;
        if ( ! commentID || ! body ) {
            return NextResponse.json({ message: "commentID is required." }, { status: 400 });
        }

        const replies = await getCommentReplies({ commentID: commentID });
              
        if (replies) {
            return NextResponse.json(replies, { status: 200 })
        } else {
            return NextResponse.json({ message: "No Replies"}, { status: 200 })
        }
        
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while getting replies."}, { status: 500 })
    }
}