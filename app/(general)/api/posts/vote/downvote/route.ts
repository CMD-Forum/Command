import { NextResponse } from "next/server";

import { lucia } from "@/app/(general)/lib/auth";
import { checkIfVoted, downvote, removeUpvote } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {

    try {

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

        const body = await req.json();
        let { postID } = body;
        if ( ! postID ) {
            return NextResponse.json({ message: "userID and postID are required." }, { status: 400 });
        }

        const voted = await checkIfVoted({ userID: user.id, postID: postID });

        if ( voted.downvote === true ) {
            return NextResponse.json({ message: "Already Downvoted"}, { status: 200 });
        }

        if ( voted.upvote === true ) {
            await removeUpvote({ userID: user.id, postID: postID });
        }

        const downvoted = await downvote({ userID: user.id, postID: postID });
              
        return NextResponse.json(downvoted, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while downvoting."}, { status: 500 })
    }
}