import { NextResponse } from "next/server";

import { checkIfReplies } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ commentID: string } >}) {
    try {
        const { commentID } = await params;

        if (!commentID) return NextResponse.json({ error: "commentID is required." }, { status: 400 });

        const replies = await checkIfReplies({ commentID: commentID });
              
        if (replies) return NextResponse.json(replies, { status: 200 })
        else return new NextResponse(null, { status: 204 });

    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ error: "Error occurred while checking for replies."}, { status: 500 })
    }
}