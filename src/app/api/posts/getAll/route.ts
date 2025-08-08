import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { calculateControversialScore, calculateHotScore } from "@/lib/post_sorts";
import { log } from "@/lib/utils";

export async function GET(req: NextRequest) {
    try {
        const PAGE = parseInt(req.nextUrl.searchParams.get("page") || "0");
        const SORT = req.nextUrl.searchParams.get("sort");

        if (SORT === "" || !SORT) { return NextResponse.json({ message: "Sort is required." }, { status: 400 })}
        if (Number.isNaN(PAGE)) { return NextResponse.json({ message: "Page is required and needs to be a number." }, { status: 400 })}

        const INCLUDE = {
            author: {
                select: {
                    id: true,
                    username: true,
                    createdAt: true,
                    image: true,
                    description: true,
                }
            },
            community: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    description: true,
                    createdAt: true,
                },
            },
        }
        const SKIP = PAGE * 10;
        const TAKE = 10;

        let sortedPosts;
        switch (SORT.toLowerCase()) {
            case "hot":
                { 
                    const POSTS = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        include: INCLUDE
                    });
                    
                    const SORTED_POSTS_PROMISE = POSTS.map(async (POST) => {
                    const UPVOTES = await db.upvotes.count({ where: { postID: POST.id } });
                    const DOWNVOTES = await db.downvotes.count({ where: { postID: POST.id } });
                    const HOT_SCORE = calculateHotScore(UPVOTES, DOWNVOTES, POST.createdAt);
                    return { ...POST, HOT_SCORE };
                });
    
                const RESOLVED_POSTS = await Promise.all(SORTED_POSTS_PROMISE);
                sortedPosts = RESOLVED_POSTS.sort((a, b) => {
                    if (b.HOT_SCORE === a.HOT_SCORE) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    return b.HOT_SCORE - a.HOT_SCORE;
                });
                break; }
            case "new":
                {
                    sortedPosts = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        orderBy: { createdAt: "desc" },
                        include: INCLUDE
                    });
                    break;
                }
            case "old":
                { 
                    sortedPosts = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        orderBy: { createdAt: "asc" },
                        include: INCLUDE
                    });
                    break;
                }
            case "top":
                { 
                    const POSTS = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        include: INCLUDE
                    });

                    const SORTED_POSTS_PROMISE = POSTS.map(async (POST) => {
                        const UPVOTES = await db.upvotes.count({ where: { postID: POST.id } });
                        const DOWNVOTES = await db.downvotes.count({ where: { postID: POST.id } });
                        const SCORE = UPVOTES - DOWNVOTES;
                        return { ...POST, SCORE };
                    });

                    const RESOLVED_POSTS = await Promise.all(SORTED_POSTS_PROMISE);
                    sortedPosts = RESOLVED_POSTS.sort((a, b) => {
                        if (b.SCORE === a.SCORE) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        return b.SCORE - a.SCORE;
                    });
                    break;
                }
            case "controversial":
                { 
                    const POSTS = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        include: INCLUDE
                    });

                    const SORTED_POSTS_PROMISE = POSTS.map(async (POST) => {
                        const UPVOTES = await db.upvotes.count({ where: { postID: POST.id } });
                        const DOWNVOTES = await db.downvotes.count({ where: { postID: POST.id } });

                        const CONTROVERSY_SCORE = calculateControversialScore(UPVOTES, DOWNVOTES);
                        return { ...POST, CONTROVERSY_SCORE };
                    });

                    const RESOLVED_POSTS = await Promise.all(SORTED_POSTS_PROMISE);
                    sortedPosts = RESOLVED_POSTS.sort((a, b) => {
                        if (b.CONTROVERSY_SCORE === a.CONTROVERSY_SCORE) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        return b.CONTROVERSY_SCORE - a.CONTROVERSY_SCORE;
                    });

                    break;
                }
            case "comments":
                { 
                    sortedPosts = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        orderBy: { comments: { _count: "desc" } },
                        include: INCLUDE
                    });
                    break;
                }
            default:
                { 
                    sortedPosts = await db.post.findMany({
                        skip: SKIP,
                        take: TAKE,
                        orderBy: { createdAt:  "desc" },
                        include: INCLUDE
                    });
                    break;
                }
        }

        const POST_COUNT = await db.post.count();
              
        return NextResponse.json({ posts: sortedPosts, postCount: POST_COUNT }, { status: 200 })
    } catch (error) {
        log({ type: "error", message: error, scope: "/api/posts/getAll/route.ts" });
        return NextResponse.json({ message: "Error occurred while fetching posts."}, { status: 500 })
    }
}