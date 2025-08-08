import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { checkIfVotedOnPost } from "@/lib/data";
import { log } from "@/lib/utils";

export async function authPOST( req: Request, ctx: ContextWithAuth ) {
    try {
        if (!ctx.userId) { return new NextResponse(null, { status: 401 })}

        const { postID: POST_ID } = await req.json();
        if (!POST_ID) { return NextResponse.json({ message: "postID is required." }, { status: 400 })}

        const voted = await checkIfVotedOnPost({ userID: ctx.userId, postID: POST_ID });
              
        return NextResponse.json(voted, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while fetching vote."}, { status: 500 })
    }
}

export const POST = withAuth(authPOST, true);