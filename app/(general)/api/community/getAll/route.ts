import { NextResponse } from "next/server";

import { prisma } from "@/app/(general)/lib/db";
import { logError } from "@/app/(general)/lib/utils";

export async function POST( req: Request ) {
    try {
        const body = await req.json();
        let { page } = body;
        if ( ! page ) {
            return NextResponse.json({ message: "Page is required." }, { status: 400 });
        }

        const communitys = await prisma.community.findMany({
            skip: page * 10,
            take: 10,
        });

        const communityCount = await prisma.community.count();

        return NextResponse.json({communitys, communityCount}, { status: 200 })
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while fetching communitys."}, { status: 500 })
    }
}