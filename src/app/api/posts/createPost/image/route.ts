import { NextResponse } from "next/server";
import xss from "xss";

import { lucia } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";
import lqipModern from "lqip-modern";

export async function POST(req: Request) {
    try {
        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");

        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })}
        
        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user?.id) { return new NextResponse(null, { status: 401 })}

        const { title: TITLE, communityId: COMMUNITY_ID, image: IMAGE, imagealt: IMAGE_ALT } = await req.json();
        const EXISTING_COMMUNITY = db.comment.findUnique({ where: { id: COMMUNITY_ID }});

        if (!EXISTING_COMMUNITY) return NextResponse.json({ message: "That community doesn't exist." }, { status: 400 });
        if (IMAGE === "" || IMAGE === null) return NextResponse.json({ message: "Image must not be blank." }, { status: 400 });
        if (IMAGE_ALT === "" || IMAGE_ALT === null) return NextResponse.json({ message: "Image alt must not be blank." }, { status: 400 });

        const FETCHED_IMAGE = await fetch(IMAGE);
        const IMAGE_BUFFER = Buffer.from(await FETCHED_IMAGE.arrayBuffer());
        const PREVIEW_IMAGE = await lqipModern(IMAGE_BUFFER);

        const post = await db.post.create({
            data: {
                title: xss(TITLE),
                content: "",
                public: user.public,
                imageurl: xss(IMAGE),
                imagealt: xss(IMAGE_ALT),
                imageblur: PREVIEW_IMAGE.metadata.dataURIBase64,
                author: {
                    connect: {
                        id: user.id,
                    },
                },
                community: {
                    connect: {
                        id: xss(COMMUNITY_ID),
                    },
                },    
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while creating post, please check your request for errors."}, { status: 500 });
    }
}
