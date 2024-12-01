"use client";

import { 
    HomeIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ViewColumnsIcon
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllUserMembershipRecords } from "@/app/(general)/lib/data";
import { useSession } from "@/app/(general)/lib/sessioncontext";
import Dialog from "../dialog/dialog";

/**
 * ## Sidebar
 * ---
 * Sidebar of the website.
 */

export default function Sidebar() {

    const [userMemberships, setUserMemberships] = useState<any[]>();
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const { user } = useSession();

    useEffect(() => {
        async function fetchUserMembership() {
            setIsLoading(true);
            if ( user?.id ) {
                const memberships = await getAllUserMembershipRecords({ userID: user.id });
                if ( memberships ) {
                    memberships.memberships.map((membership) => {
                        // eslint-disable-next-line no-unused-vars
                        const communityDisplayName = membership.community.name;
                    });     
                    setIsLoading(false);               
                }
                // @ts-ignore
                setUserMemberships(memberships);   
                setIsLoading(false);             
            }
        }

        fetchUserMembership();
    }, [user?.id])

    return (
        <>
                <nav className="hidden md:flex sticky max-h-screen top-16" role="navigation">         
                    <div 
                        className={`bg-background p-4 sticky h-screen overflow-y-auto hide-scrollbar overflow-x-hidden w-[300px]`}
                        role="navigation"
                        aria-label="Sidebar"
                    >
                        <div className="overflow-y-auto overflow-x-hidden">
                            <div className="flex flex-col gap-1">
                                <Link className={`navlink-sidebar ${pathname.startsWith("/posts/") || pathname === "/posts" ? "after-active" : null}`} href={"/posts"} aria-label="Posts"><HomeIcon className="w-5 h-5" /><span className={`flex`}>Posts</span></Link>
                                <Link className={`navlink-sidebar ${pathname.startsWith("/c/") || pathname === "/c" ? "after-active" : null}`} href={"/c"} aria-label="Community"><ViewColumnsIcon className="w-5 h-5" /><span className={`flex`}>Community</span></Link>
                                <Link className={`navlink-sidebar ${pathname.startsWith("/search/") || pathname === "/search" ? "after-active" : null}`} href={"/search"} aria-label="Search"><MagnifyingGlassIcon className="w-5 h-5" /><span className={`flex`}>Search</span></Link>                
                                {/*<Link className={`navlink-sidebar ${pathname.startsWith("/create/") || pathname === "/create" ? "after-active" : null}`} href={"/create"} aria-label="Create"><PlusIcon className="w-5 h-5" /><span className={`flex`}>Create</span></Link>*/}
                                <Dialog>
                                    <Dialog.Trigger><button className={`navlink-sidebar ${pathname.startsWith("/create/") || pathname === "/create" ? "after-active" : null}`} aria-label="Create"><PlusIcon className="w-5 h-5" />Create</button></Dialog.Trigger>
                                    <Dialog.Content>
                                        <Dialog.Title className="mb-4">What do you want to create?</Dialog.Title>
                                        <Dialog.ButtonContainer>
                                            <Link className="navlink-full" href={"/create/post"}>Post</Link>
                                            <Link className="navlink-full" href={"/create/community"}>Community</Link>
                                            <Dialog.CloseButton><button className="navlink">Cancel</button></Dialog.CloseButton>
                                        </Dialog.ButtonContainer>
                                    </Dialog.Content>
                                </Dialog>
                            </div>

                            { user ? 
                                <>
                                    <hr className='mt-2 mb-2' />
                                    {/* @ts-ignore */}
                                    { userMemberships && userMemberships.memberships.length > 0 ? 
                                        <>
                                            <div className="flex flex-col gap-1">
                                                { isLoading ?
                                                    <div className="flex flex-col gap-1">
                                                        <div className='bg-border rounded-lg animate-pulse !w-[40px] !h-[40px]' />  
                                                        <div className='bg-border rounded-lg animate-pulse !w-[40px] !h-[40px]' />  
                                                        <div className='bg-border rounded-lg animate-pulse !w-[40px] !h-[40px]' />  
                                                    </div>
                                                :
                                                    <div className="flex flex-col gap-1">
                                                        {/* @ts-ignore */}
                                                        { userMemberships && userMemberships.memberships.map((membership) => {
                                                            return (
                                                                <Link key={membership.community.id} className={`navlink-sidebar ${pathname === `/c/${membership.community.name}` ? "after-active" : null}`} href={`/c/${membership.community.name}`} aria-label={membership.community.name}>
                                                                    <img src={membership.community.image} alt={membership.community.name} className="w-5 h-5 rounded" />
                                                                    <span className={`flex`}>{membership.community.name}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>                               
                                                }
                                            </div>
                                        </>
                                    :
                                        null
                                    }
                                </>
                                :
                                null
                            }
                        </div>  
                    </div>                     
                </nav>
        </>
    );
}