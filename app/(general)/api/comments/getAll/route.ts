import { NextResponse } from "next/server";

import { getPostComments } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

// TO-DO: Add authentication

export async function POST( req: Request ) {

    try {
        const body = await req.json();
        let { postID } = body;
        if ( ! postID || ! body ) {
            return NextResponse.json({ message: "postID is required." }, { status: 400 });
        }

        const postComments = await getPostComments({ postID: postID });
              
        if (postComments) {
            return NextResponse.json(postComments, { status: 200 })
        } else {
            return NextResponse.json({ message: "No Comments"}, { status: 200 })
        }
        
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while getting comments."}, { status: 500 })
    }
}