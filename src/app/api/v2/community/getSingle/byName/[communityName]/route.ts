import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ communityName: string }> }) {
    try {
        const { communityName } = await params;

        const SESSION = await auth.api.getSession({
            headers: req.headers
        });

        /*const { valid: API_KEY_VALID, key } = await auth.api.verifyApiKey({
            body: {
                key: req.headers.get("x-api-key") ?? "",
            },
        });*/

        if (!communityName) return NextResponse.json({ data: null, error: "The name of the community is required." }, { status: 400 });

        const community = await db.community.findUnique({ where: { name: communityName }});
        if (!community) return NextResponse.json({ data: null, error: "Community not found." }, { status: 200 });

        if (community.public === false) {
            if (SESSION) {
                const USER_IS_MODERATOR = await db.communityModerator.findFirst({ where: { communityID: community.id.toString(), userID: SESSION.user.id }});

                if (USER_IS_MODERATOR) return NextResponse.json(community, { status: 200 });
            } else return NextResponse.json({ data: null, error: "Community is private." }, { status: 401 });
        }
              
        return NextResponse.json({ data: community }, { status: 200 })

    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ data: null, error: "Error occurred while fetching community."}, { status: 500 })
    }
}