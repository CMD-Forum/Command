import { NextResponse } from "next/server";

import { prisma } from "@/app/(general)/lib/db";

export async function POST( req: Request ) {

    try {
        const body = await req.json();
        let { page, sort } = body;
        if ( ! page ) {
            return NextResponse.json({ message: "Page is required." }, { status: 400 });
        }
        if ( ! sort ) {
            sort === "Hot"
        }

        let orderBy;
        switch (sort) {
            case "Hot":
                orderBy = { upvotes: { _count: 'desc' } };
                break;
            case "New":
                orderBy = { createdAt: 'desc' };
                break;
            case "Old":
                orderBy = { createdAt: 'asc' };
                break;
            case "Top":
                orderBy = { upvotes: { _count: 'desc' } };
                break;                
            case "Controversial":
                orderBy = { downvotes: { _count: 'desc' } };
                break;
            case "Comments":
                orderBy = { comments: { _count: 'desc' } };
                break;
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        const posts = await prisma.post.findMany({
            // @ts-ignore
            skip: page * 10,
            take: 10,
            // @ts-ignore
            orderBy,
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
                        // eslint-disable-next-line camelcase
                        display_name: true,
                        image: true,
                        public: true,
                        description: true,
                        admins: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });

        const postCount = await prisma.post.count();
              
        return NextResponse.json({posts, postCount}, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error occurred while fetching posts."}, { status: 500 })
    }
}