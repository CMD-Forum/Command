import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ communityID: string }> }) {
    try {
        const { communityID: COMMMUNITY_ID } = await params;

        const SESSION = await auth.api.getSession({
            headers: req.headers
        });
        
        if (!COMMMUNITY_ID) return NextResponse.json({ message: "CommunityID is required." }, { status: 400 });

        const community = await db.community.findUnique({ where: { id: COMMMUNITY_ID }});
        if (!community) return NextResponse.json({ message: "Community not found."}, { status: 404 });
        
        if (community.public === false) {
            if (SESSION) {
                const USER_IS_MODERATOR = await db.communityModerator.findFirst({ where: { communityID: community.id.toString(), userID: SESSION.user.id }});

                if (USER_IS_MODERATOR) return NextResponse.json(community, { status: 200 });
            } else return NextResponse.json({ message: "Community is private." }, { status: 401 });
        }
              
        return NextResponse.json(community, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while fetching community."}, { status: 500 })
    }
}