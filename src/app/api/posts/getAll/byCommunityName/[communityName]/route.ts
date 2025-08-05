import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ communityName: string }> }) {
    try {
        const PAGE = parseInt(req.nextUrl.searchParams.get("page") || "0");
        const SORT = req.nextUrl.searchParams.get("sort");

        const { communityName: COMMUNITY_NAME } = await params;

        if (!COMMUNITY_NAME) { return NextResponse.json({ message: "UserID is required." }, { status: 400 })}

        if (SORT === "" || !SORT) { return NextResponse.json({ message: "Sort is required." }, { status: 400 })}
        if (Number.isNaN(PAGE)) { return NextResponse.json({ message: "Page is required and needs to be a number." }, { status: 400 })}

        let orderBy;
        switch (SORT) {
            case "Hot":
                orderBy = { upvotes: { _count: "desc" } };
                break;
            case "New":
                orderBy = { createdAt: "desc" };
                break;
            case "Old":
                orderBy = { createdAt: "asc" };
                break;
            case "Top":
                orderBy = { upvotes: { _count: "desc" } };
                break;                
            case "Controversial":
                orderBy = { downvotes: { _count: "desc" } };
                break;
            case "Comments":
                orderBy = { comments: { _count: "desc" } };
                break;
            default:
                orderBy = { createdAt: "desc" };
                break;
        }

        const POSTS = await db.post.findMany({
            skip: PAGE * 10,
            take: 10,
            // TO-DO: Fix this
            // @ts-expect-error: Don't know what causes this
            orderBy,
            where: {
                community: {
                    name: COMMUNITY_NAME,
                },
            },
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
        const POST_COUNT = await db.post.count({ where: { community: { name: COMMUNITY_NAME } }});
              
        return NextResponse.json({ posts: POSTS, post_count: POST_COUNT }, { status: 200 })
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while fetching posts. Make sure you have included all fields correctly."}, { status: 500 })
    }
}