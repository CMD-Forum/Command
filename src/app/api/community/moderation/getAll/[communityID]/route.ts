import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ communityID: string }> }) {
    try {
        const { communityID } = await params;
        if (!communityID) return NextResponse.json({ message: "CommunityID is required." }, { status: 400 });

        const admins = await db.communityModerator.findMany({ 
            where: { 
                communityID: communityID 
            },
            include: {
                User: {
                    select: {
                        username: true,
                        image: true,
                        moderatedCommunities: true,
                    },
                },
            },
        });

        if (!admins || admins === null) return NextResponse.json({ message: "This community has no administrators."}, { status: 204 });
              
        return NextResponse.json(admins, { status: 200 })
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while fetching community administrators."}, { status: 500 })
    }
}