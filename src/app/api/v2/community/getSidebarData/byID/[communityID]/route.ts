import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";
import { Community, User } from "@prisma/client";

export interface CommunitySidebarDataAPIResponse {
    response: {
        community: Community;
        information: {
            about: string;
            rules: string[];
            moderators: Partial<User>[];
            related_communities: Partial<Community>[] | null;
        },
        members: number;
        posts: number;
    },
    error: string;
}

async function authGET(req: Request, context: ContextWithAuth) {
    try {
        const { communityID } = await context.params;

        if (!communityID) return NextResponse.json({ error: "communityID is required." }, { status: 400 });

        let isAll = false;
        if (communityID === "") isAll = true;

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
            where: { id: communityID },
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
            if (context.session?.id) {
                const userId = context.userId;
                const USER_IS_MODERATOR = isAll ? false : await db.communityModerator.findFirst({ where: { communityID: COMMUNITY.id.toString(), userID: userId }});

                if (userId && USER_IS_MODERATOR) {
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

        const STRUCTURED_COMMUNITY = {
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
            
        return NextResponse.json({ response: STRUCTURED_COMMUNITY }, { status: 200 });
    } catch (error) {
        log({ message: error, type: "error", scope: "API > Community > getSidebarData > byID" })
        return NextResponse.json({ error: "Error occurred while fetching community sidebar data."}, { status: 500 });
    }
}

export const GET = withAuth(authGET, false)