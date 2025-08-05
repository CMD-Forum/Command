/**
 * To be completely redone at some point later
 */

// import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
 
/*export async function generateMetadata(
    { params }: { params: Promise<{ communityName: string }> },
): Promise<Metadata> {
    const { communityName } = await params;
    return { title: communityName ? `c/${communityName.toLowerCase()} - Moderation` : "" }
}*/

export default async function ModerationPage({ params }: { params: Promise<{ communityName: string }> }) {
    
    const { communityName: COMMUNITY_NAME } = await params;

    const COMMUNITY = await db.community.findUnique({
        where: {
            name: COMMUNITY_NAME
        },
        select: {
            id: true,
            moderators: {
                select: {
                    userID: true,
                }
            }
        }
    })

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (COMMUNITY?.id && session?.user?.id) {
        const IS_ADMIN = await db.communityModerator.findUnique({
            where: {
                userID_communityID: { userID: session.user?.id, communityID: COMMUNITY?.id }
            },
        })
        
        if (IS_ADMIN) {
            return (
                <main className="flex min-h-screen flex-col w-full">
                    <div className="error flex flex-col w-full">
                        <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
                            <h1 className="header">Moderation</h1>
                            <p className={"subtitle"}>You are viewing the moderation page of c/{COMMUNITY_NAME}.</p>   
                        </div>

                        <div className="flex flex-col lg:pb-12 px-4 mb-6 gap-4">
                            <p>TBD</p>
                        </div>
                    </div>
                </main>
            );
        } else {
            redirect(`/c/${COMMUNITY_NAME}`);
        }
    } else {
        redirect(`/c/${COMMUNITY_NAME}`);
    }

}