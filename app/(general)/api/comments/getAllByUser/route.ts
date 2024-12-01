import { NextResponse } from "next/server";

import { getUserComments } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

// TO-DO: Add authentication

export async function POST( req: Request ) {

    try {
        const body = await req.json();
        let { userID } = body;
        if ( ! userID ) {
            return NextResponse.json({ message: "userID is required." }, { status: 400 });
        }

        const userComments = await getUserComments({ userID: userID });
              
        return NextResponse.json(userComments, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while getting user comments."}, { status: 500 })
    }
}