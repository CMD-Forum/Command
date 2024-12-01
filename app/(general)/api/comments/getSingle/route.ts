import { NextResponse } from "next/server";

import { getComment } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

// TO-DO: Add authentication

export async function POST( req: Request ) {

    try {
        const body = await req.json();
        let { commentID } = body;
        if ( ! commentID ) {
            return NextResponse.json({ message: "commentID is required." }, { status: 400 });
        }

        const comment = await getComment({ commentID: commentID });
              
        return NextResponse.json(comment, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while getting comment."}, { status: 500 })
    }
}