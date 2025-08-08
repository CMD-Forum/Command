import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";
import { Community, CommunityRule, User } from "@prisma/client";

export interface CommunitySidebarDataAPIResponse {
    response: {
        community: Community;
        information: {
            about: string;
            rules: CommunityRule[];
            moderators: Partial<User>[];
            related_communities: Partial<Community>[] | null;
        },
        members: number;
        posts: number;
    },
    error: string;
}

async function authGET(req: Request, ctx: ContextWithAuth) {
    try {
        const { communityName } = await ctx.params;

        if (!communityName) return NextResponse.json({ error: "communityName is required." }, { status: 400 });

        let isAll = false;

        const COMMUNITY_NAME = communityName.toLowerCase();
        if (COMMUNITY_NAME.length < 2 || COMMUNITY_NAME.length > 20) return NextResponse.json({ error: "Community name must be between 2 and 20 characters." }, { status: 400 });
        if (!/^[a-zA-Z0-9_]*$/.test(COMMUNITY_NAME)) return NextResponse.json({ error: "Community name must be alphanumeric." }, { status: 400 });
        if (COMMUNITY_NAME === "all") isAll = true;

        const COMMUNITY = isAll ? {
            id: 0,
            name: "all",
            public: true,
            description: "The community for everything and anything!",
            sidebar_content: "# The community for anything and everything.\nWelcome to the front page of Command, where the best posts go!",
            rules: [{ title: "Normal sitewide rules apply.", description: "Please visit the rules page for more information." }],
            moderators: [{ username: "Command", image: "/metadata/Logo-512x512.svg", description: "For any non-development issues, please contact an administrator. Contact a GitHub contributor for development issues." }],
            createdAt: new Date("2023-12-01T00:00:00.000Z"),
        } : await db.community.findUnique({ 
            where: { name: COMMUNITY_NAME },
            include: {
                rules: true,
                moderators: {
                    include: {
                        User: {
                            select: {
                                username: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        if (!COMMUNITY) return NextResponse.json({ error: "Community not found."}, { status: 404 });

        if (COMMUNITY.public === false) {
            if (ctx.session?.id || ctx.apiKey?.valid) {
                const USER_IS_MODERATOR = isAll ? false : await db.communityModerator.findFirst({ where: { communityID: COMMUNITY.id.toString(), userID: ctx.userId || ctx.apiKey?.value?.userId } });

                if ((ctx.session?.userId || ctx.apiKey?.value?.userId) && USER_IS_MODERATOR) {
                    const STRUCUTRED_COMMUNITY = {
                        community: COMMUNITY,
                        information: {
                            about: isAll ? "# The community for anything and everything.\nWelcome to the front page of Command, where the best posts go!" : COMMUNITY.sidebar_content,
                            rules: COMMUNITY.rules,
                            moderators: COMMUNITY.moderators,
                            related_communities: null,
                        },
                        members: isAll ? await db.user.count() : await db.communityMembership.count({ where: { communityId: COMMUNITY.id.toString() }}),
                        posts: isAll ? await db.post.count() : await db.post.count({ where: { communityId: COMMUNITY.id.toString() }}),
                    }
                        
                    return NextResponse.json({ response: STRUCUTRED_COMMUNITY }, { status: 200 });
                }
            } else return NextResponse.json({ error: "Community is private." }, { status: 401 });
        }
        
        const MODERATORS = isAll ? [{ username: "Command", image: "/metadata/Logo-512x512.svg", description: "For any non-development issues, please contact an administrator. Contact a GitHub contributor for development issues." }] : await db.communityModerator.findMany({ where: { communityID: COMMUNITY.id.toString() }});

        const STRUCUTRED_COMMUNITY = {
            community: COMMUNITY,
            information: {
                about: isAll ? "# The community for anything and everything.\nWelcome to the front page of Command, where the best posts go!" : COMMUNITY.sidebar_content,
                rules: COMMUNITY.rules,
                moderators: MODERATORS,
                related_communities: null,
            },
            members: isAll ? await db.user.count() : await db.communityMembership.count({ where: { communityId: COMMUNITY.id.toString() }}),
            posts: isAll ? await db.post.count() : await db.post.count({ where: { communityId: COMMUNITY.id.toString() }}),
        }
            
        return NextResponse.json({ response: STRUCUTRED_COMMUNITY }, { status: 200 });
    } catch (error) {
        log({ message: error, type: "error" });
        return NextResponse.json({ error: "Error occurred while fetching community sidebar data."}, { status: 500 });
    }
}

export const GET = withAuth(authGET, false);