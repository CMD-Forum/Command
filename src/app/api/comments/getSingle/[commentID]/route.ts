import { NextResponse } from "next/server";

import { getComment } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ commentID: string } >}) {
    try {
        const { commentID } = await params;

        if (!commentID) {
            return NextResponse.json({ message: "commentID is required." }, { status: 400 });
        }

        const comment = await getComment({ commentID: commentID });

        if (comment) {
            return NextResponse.json(comment, { status: 200 });
        } else {
            return NextResponse.json({ status: 204 });
        } 
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while getting comment."}, { status: 500 })
    }
}