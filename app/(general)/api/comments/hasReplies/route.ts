import { NextResponse } from "next/server";

import { checkIfReplies } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {

    try {
        const body = await req.json();
        let { commentID } = body;
        if ( ! commentID || ! body ) {
            return NextResponse.json({ message: "commentID is required." }, { status: 400 });
        }

        const replies = await checkIfReplies({ commentID: commentID });
              
        if (replies) {
            return NextResponse.json(replies, { status: 200 })
        } else {
            return NextResponse.json({ message: "No Replies"}, { status: 404 })
        }
        
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while checking for replies."}, { status: 500 })
    }
}