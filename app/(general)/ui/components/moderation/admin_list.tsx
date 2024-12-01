import Link from "next/link";

import dayjs from "@/app/(general)/lib/dayjs";

import { prisma } from "../../../lib/db";
import ProfileImage from "../account/ProfileImage";

export async function CommunityAdministrators({ communityId }: { communityId: string }) {

    const community = await prisma.community.findUnique({
        where: {
            id: communityId,
        }
    });

    if ( ! community ) {
        return (
            <div className="p-6 pt-12 lg:pb-12 lg:p-12 lg:px-48">
                <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5'>
                    <p className='md:!header-2 header-3'>Sorry, looks like this community doesn&apos;t exist.</p>
                    <p className='text-center !text-white font-medium antialiased w-full'>Don&apos;t worry, you probably mistyped.</p>
                </div>            
            </div>
        );
    }

    const admins = await prisma.communityAdminship.findMany({ where: { communityId: communityId }});

    if ( ! admins || admins === null || admins === undefined || admins.length <= 0 ) {
        return (
            <div className="flex flex-row gap-4 w-full">
                <div className="bg-card border-0 border-border p-4 rounded-lg flex flex-row gap-3 items-center w-full">
                    <p>This community doesn&apos;t have any administrators.</p>
                </div>     
            </div>
        );
    } else if ( admins ) {
        return (
            <div>
                {admins.map(async (admin) => {

                    const user = await prisma.user.findUnique({
                        where: {
                            id: admin.userId,
                        },
                    });

                    if ( user ) {
                        return (
                            <Link href={`/user/${user.username}`} key={user.id} className="hover:bg-card active:bg-card border-0 border-border p-4 rounded-lg flex flex-col gap-1 w-full">
                                <div className="flex gap-2">
                                    <ProfileImage user={user} imgSize={"5"} />
                                    <Link href={`/user/${user.username}`} className="transition-all subtitle hover:!text-white">{user?.username}</Link>                                        
                                </div>
                                <p>Since the {dayjs(admin.createdAt).format("Do [of] MMMM[,] YYYY")}.</p>
                            </Link>
                        )
                    } else {
                        return (
                            <p key={admin.userId} className="subtitle">Sorry, this admin couldn&apos;t be displayed.</p>
                        );
                    }

                })}
            </div>
        );
    }
}