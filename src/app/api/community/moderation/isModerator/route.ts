import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";

export async function POST( req: Request ) {
    try {
        if (!req.body) return NextResponse.json({ message: "Request body is required." }, { status: 400 });

        const { userID, communityID } = await req.json();
        if (!communityID) return NextResponse.json({ message: "CommunityID is required." }, { status: 400 });

        const moderator = await db.communityModerator.findUnique({ where: { userID_communityID: { userID: userID, communityID: communityID } }});
        if (!moderator) return NextResponse.json(false, { status: 200 });

        return NextResponse.json(true, { status: 200 });
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while fetching community moderators."}, { status: 500 })
    }
}