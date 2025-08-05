import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";
import { Community } from "@prisma/client";

export interface JoinedCommunitiesAPIResponse {
    response: {
        communities: Community[];
    } | null;
    error?: string;
}

export async function GET(req: NextRequest) {
    try {
        // Authetication

        const session = await auth.api.getSession({
            headers: req.headers
        });

        let user_id = session?.user.id;

        const { valid: API_KEY_VALID, key } = await auth.api.verifyApiKey({
            body: {
                key: req.headers.get("x-api-key") ?? "",
            },
        });

        if (!API_KEY_VALID && !session) return NextResponse.json({ message: "You must be logged in to delete a comment." }, { status: 401 });
        if (API_KEY_VALID && !session) user_id = key?.userId;

        // Main

        const Communities = await db.community.findMany({
            where: {
                memberships: {
                    some: {
                        userId: user_id
                    }
                }
            }
        })
            
        return NextResponse.json({ response: Communities.length > 0 ? Communities as Community[] : null }, { status: 200 });
    } catch (error) {
        log({ type: "error", message: error, scope: "API > v2/account/data/getJoinedCommunities/byUserID" });
        return NextResponse.json({ error: "Error occurred while fetching joined communities."}, { status: 500 });
    }
}