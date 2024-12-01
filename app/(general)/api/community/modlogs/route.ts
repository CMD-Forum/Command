import { NextResponse } from "next/server";

import { prisma } from "@/app/(general)/lib/db";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {
    try {
        const body = await req.json();
        let { communityID, page } = body;
        if ( ! page ) {
            return NextResponse.json({ message: "Page is required." }, { status: 400 });
        }

        const modlogs = await prisma.moderationLog.findMany({
            skip: page * 10,
            take: 10,
            where: {
                communityId: communityID,
            },
        });

        const modlogCount = await prisma.moderationLog.count({ where: { communityId: communityID }});

        return NextResponse.json({modlogs, modlogCount}, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while fetching communitys."}, { status: 500 })
    }
}