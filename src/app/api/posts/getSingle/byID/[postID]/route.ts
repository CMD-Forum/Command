import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";

async function authGET(req: Request, context: ContextWithAuth) {
    try {
        const { postID: POST_ID } = await context.params;

        if (!POST_ID) { return NextResponse.json({ message: "Post ID is required." }, { status: 400 })}

        const post = await db.post.findUnique({ 
            where: { id: POST_ID },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        createdAt: true,
                        updatedAt: true,
                        image: true,
                        description: true,
                    }
                },
                community: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        public: true,
                        description: true,
                    },
                },
            },
        });

        if (!post) { return NextResponse.json({ message: "Post not found."}, { status: 404 })}
        const IS_MODERATOR = await db.communityModerator.findFirst({ where: { userID: context.userId, communityID: post.community.id } });
        if (post.community.public === false && context.userId !== post.authorId && !IS_MODERATOR) { return NextResponse.json({ message: "Post is private."}, { status: 403 })}
              
        return NextResponse.json(post, { status: 200 })
    } catch (error) {
        log({ type: "error", message: error });
        return NextResponse.json({ message: "Error occurred while fetching post."}, { status: 500 })
    }
}

export const GET = withAuth(authGET, true)