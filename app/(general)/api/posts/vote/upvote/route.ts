import { NextResponse } from "next/server";

import { lucia } from "@/app/(general)/lib/auth";
import { checkIfVoted, removeDownvote, upvote } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {

    const authorizationHeader = req.headers.get("Authorization");
    const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

    if ( ! sessionId ) {
        return new NextResponse(null, {
            status: 401
        });
    }   
    
    const { user } = await lucia.validateSession(sessionId);

    if ( ! user?.id ) {
        return new NextResponse(null, {
            status: 401
        });
    }

    try {
        const body = await req.json();
        let { postID } = body;
        if ( ! postID ) {
            return NextResponse.json({ message: "userID and postID are required." }, { status: 400 });
        }

        const voted = await checkIfVoted({ userID: user.id, postID: postID });

        if ( voted.upvote === true ) {
            return NextResponse.json({ message: "Already Upvoted"}, { status: 200 });
        }

        if ( voted.downvote === true ) {
            await removeDownvote({ userID: user.id, postID: postID });
        }

        const upvoted = await upvote({ userID: user.id, postID: postID });
              
        return NextResponse.json(upvoted, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while upvoting."}, { status: 500 })
    }
}