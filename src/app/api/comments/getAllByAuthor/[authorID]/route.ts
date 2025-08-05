import { NextResponse } from "next/server";

import { getUserComments } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ authorID: string }> }) {
    try {
        const { authorID } = await params;

        if (!authorID) {
            return NextResponse.json({ message: "userID is required." }, { status: 400 });
        }

        const { userComments, error } = await getUserComments({ userID: authorID });
        
        if (error) throw new Error(error);
        
        if (!userComments || userComments.toString().length <= 0) {
            return NextResponse.json({ status: 204 });
        } else {
            return NextResponse.json(userComments, { status: 200 });
        }
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while getting user comments."}, { status: 500 })
    }
}