import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAuth } from "@/app/(general)/lib/auth";
import { prisma } from "@/app/(general)/lib/db";
 
export async function generateMetadata(
  { params }: { params: { community: string } },
): Promise<Metadata> {
  const name = params.community.toLowerCase()
  return {
    title: name ? `c/${name} - Moderation` : "",
  }
}

export default async function ModerationPage({ params }: { params: { community: string } }) {
    
    const community = await prisma.community.findUnique({
        where: {
            name: params.community
        },
        select: {
            id: true,
            admins: {
                select: {
                    userId: true,
                }
            }
        }
    })

    const session = await getAuth();

    if ( community?.id && session.user?.id ) {
        const isAdmin = await prisma.communityAdminship.findUnique({
            where: {
                userId_communityId: { userId: session.user?.id, communityId: community?.id }
            },
        })       
        
        if ( isAdmin ) {
            return (
                <main className="flex min-h-screen flex-col w-full">
                    <div className="error flex flex-col w-full">
                        <div className="flex flex-col border-0 border-border p-6 md:pt-12 bg-background/35 md:mt-0 lg:px-4">
                            <h1 className="header">Moderation</h1>
                            <p className={`subtitle`}>You are viewing the moderation page of c/{ params.community }.</p>   
                        </div>

                        <div className='flex flex-col lg:pb-12 px-4 mb-6 gap-4'>
                            <p>TBD</p>
                        </div>
                    </div>
                </main>
            );
        } else {
            redirect(`/c/${params.community}`);
        }
    } else {
        redirect(`/c/${params.community}`);
    }

}