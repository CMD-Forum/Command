import { NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { checkIfVotedOnComment } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function POST( req: Request ) {
    try {
        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");
        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })}
        
        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) { return new NextResponse(null, { status: 401 })}

        const { commentID: COMMENT_ID } = await req.json();
        if (!COMMENT_ID) { return NextResponse.json({ message: "commentID is required." }, { status: 400 })}

        const voted = await checkIfVotedOnComment({ userID: user.id, commentID: COMMENT_ID });
              
        return NextResponse.json(voted, { status: 200 })
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while fetching vote."}, { status: 500 })
    }
}