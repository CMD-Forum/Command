import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import { CREATE_COMMUNITY_SCHEMA } from "@/lib/schemas";
import { log } from "@/lib/utils";

async function authPOST(req: Request, ctx: ContextWithAuth ) {
    try {
        const BODY = await req.json();
        const { name, short_description, image_url } = CREATE_COMMUNITY_SCHEMA.parse(BODY);

        const COMMUNITY_NAME_EXISTS = await db.community.findUnique({ where: { name: name } });

        if (COMMUNITY_NAME_EXISTS) return NextResponse.json({ community: null, message: "Community with this name already exists."}, { status: 400 });

        const newCommunity = await db.community.create({
            data: {
                name: name.toLowerCase(),
                description: short_description,
                image: image_url,
            }
        });

        await db.communityModerator.create({ 
            data: { 
                userID: ctx.userId, 
                communityID: newCommunity.id 
            } 
        });

        return NextResponse.json({ community: newCommunity, message: "Community has been created."}, { status: 201 })

    } catch(error) {
        log({ type: "error", message: error });
        return NextResponse.json({ message: "An error occurred while creating the community."}, { status: 500 });
    }
}

export const GET = withAuth(authPOST);