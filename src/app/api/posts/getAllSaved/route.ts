import { NextRequest, NextResponse } from "next/server";

import { lucia } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {    
        const searchParams = req.nextUrl.searchParams;
        const PAGE = searchParams.get("page");

        const AUTH_HEADER = req.headers.get("Authorization");
        const SESSION_ID = lucia.readBearerToken(AUTH_HEADER ?? "");
        if (!SESSION_ID) { return new NextResponse(null, { status: 401 })}
        
        const { user } = await lucia.validateSession(SESSION_ID);
        if (!user || !user.id) { return NextResponse.json({ error: "User is unauthorized to access this resource." }, { status: 401 })}
        if (PAGE === null || Number.isNaN(PAGE)) { return NextResponse.json({ message: "Page is required and needs to be a number." }, { status: 400 })}

        const SAVED_POSTS = await db.savedPosts.findMany({ 
            where: { userID: user.id },
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
        const POST_COUNT = await db.savedPosts.count({ where: { userID: user.id }});

        return NextResponse.json({ posts: POSTS, postCount: POST_COUNT }, { status: 200 } )
    } catch (error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Error occurred while fetching saved posts, please check your request for errors."}, { status: 500 });
    }
}
