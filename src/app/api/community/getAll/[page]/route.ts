import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { log } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ page: string }> }) {
    try {
        const { page } = await params;

        if (!page) return NextResponse.json({ message: "Page is required." }, { status: 400 });

        const communities = await db.community.findMany({ skip: parseInt(page) * 10, take: 10 });
        const communityCount = await db.community.count();

        return NextResponse.json({ communities, communityCount }, { status: 200 })
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while fetching communitys."}, { status: 500 })
    }
}