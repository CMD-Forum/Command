import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const { communityID, page } = await req.json();
        if (!communityID) return NextResponse.json({ message: "CommunityID is required." }, { status: 400 });
        if (!page) return NextResponse.json({ message: "Page is required." }, { status: 400 });

        const MODLOGS = await db.moderationLog.findMany({
            skip: page * 10,
            take: 10,
            where: {
                communityId: communityID,
            },
        });

        const MODLOG_COUNT = await db.moderationLog.count({ where: { communityId: communityID }});

        return NextResponse.json({ MODLOGS, MODLOG_COUNT }, { status: 200 })
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while fetching communitys."}, { status: 500 })
    }
}