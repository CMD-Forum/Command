import { NextRequest, NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";

export async function authGET(req: NextRequest, ctx: ContextWithAuth) {
    try {    
        const searchParams = req.nextUrl.searchParams;
        const PAGE = searchParams.get("page");
        
        if (!ctx.userId) { return NextResponse.json({ message: "Authentication is required." }, { status: 401 })};

        if (PAGE === null || Number.isNaN(PAGE)) { return NextResponse.json({ message: "Page is required and needs to be a number." }, { status: 400 })}

        const SAVED_POSTS = await db.savedPosts.findMany({ 
            where: { userID: ctx.userId },
            include: {
                post: {
                    include: {
                        author: {
                            select: {
                                username: true,
                            }
                        },
                        community: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        const POSTS = SAVED_POSTS.map((SAVED_POST) => SAVED_POST.post);
        const POST_COUNT = await db.savedPosts.count({ where: { userID: ctx.userId }});

        return NextResponse.json({ posts: POSTS, postCount: POST_COUNT }, { status: 200 } )
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ message: "Error occurred while fetching saved posts, please check your request for errors."}, { status: 500 });
    }
}

export const GET = withAuth(authGET, true);