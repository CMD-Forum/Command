"use client";

import { 
    ArrowRightEndOnRectangleIcon,
    Bars3Icon,
    BookOpenIcon, 
    CalendarDaysIcon, 
    ChatBubbleBottomCenterTextIcon, 
    Cog6ToothIcon, 
    HomeIcon, 
    MagnifyingGlassIcon, 
    PencilSquareIcon, 
    ShieldCheckIcon, 
    UserIcon, 
    UserPlusIcon,
    ViewColumnsIcon, 
    XMarkIcon} from "@heroicons/react/20/solid";
import { Community } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useSession } from "@/app/(general)/lib/sessioncontext";

import { inter } from "../fonts";
import { JoinCommunityButton } from "./button";
import MemberCount from "./community/memberCount";
import PostCount from "./community/postCount";

export function NavSideItems() {

    const pathname = usePathname();
    const [expanded, setExpanded] = useState(false);
    const session = useSession();

    const toggleDrawer = () => {
        if ( expanded === true ) {
            setExpanded(false);
            document.body.style.overflow = "scroll";
        } else if ( expanded === false ) {
            setExpanded(true);
            document.body.style.overflow = "hidden";
        }
    }

    return (

        <AnimatePresence initial={false} key={"sidebar_topanimatepresence"}>

            <>
                <button className={`navlink-sidebar fixed top-[9px] z-[100] ml-2 lg:hidden !w-fit !border-[1px] !border-border`} onClick={() => toggleDrawer()}><Bars3Icon className="font-medium h-5 w-5 facebookTheme:h-4 facebookTheme:w-4" /></button>
            </>

            <motion.div 
                className={`w-full top-0 left-0 h-dvh overflow-scroll fixed ${expanded === true ? "z-[1000]" : "-z-50"} backdrop-blur-sm`}
                animate={{
                    opacity: expanded ? "100%" : "0%",
                }}
                key={"sidebar_firstmotiondiv"}
            >
                <motion.div 
                    className="bg-card-light fixed top-0 z-40 w-[300px] px-4 py-2 h-full flex flex-col overflow-scroll gap-1"
                    animate={{
                        x: expanded ? "0px" : "-300px",
                    }}
                    exit={{
                        x: expanded ? "0px" : "-300px",
                    }}
                    transition={{ type: "tween" }}   
                    key={"sidebar_secondmotiondiv"}  
                >
                
                    <div className="w-full h-fit flex flex-row-reverse mt-1 mb-4">
                        <button className={`navlink-sidebar z-[100] !mb-0 !mt-0 !w-fit !border-[1px] !border-border`} onClick={() => toggleDrawer()}><XMarkIcon className="font-medium h-5 w-5 facebookTheme:h-4 facebookTheme:w-4" /></button>
                        <h1 className={`${inter.className} font-extrabold text-3xl mr-auto flex items-center hover:text-gray-300 transition-all cursor-pointer`}>CMD/&gt;</h1>
                    </div>

                    <Link 
                        className={`navlink-sidebar ${pathname === "/" ? "active" : null}`} 
                        href={"/"} 
                        prefetch={true}>
                        <HomeIcon className="w-5 h-5 mr-1" />
                        Home
                    </Link>

                    <Link 
                        className={`navlink-sidebar ${pathname.startsWith("/c/") || pathname === "/c" ? "active" : null}`} 
                        href={"/c"} 
                        prefetch={true}>
                        <ViewColumnsIcon className="w-5 h-5 mr-1" />
                        Community
                    </Link>

                    <Link 
                        className={`navlink-sidebar ${pathname.startsWith("/posts/") || pathname === "/posts" ? "active" : null}`} 
                        href={"/posts"} 
                        prefetch={true}>
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-1" />
                        Posts
                    </Link>

                    <Link 
                        className={`navlink-sidebar ${pathname === "/search" ? "active" : null}`} 
                        href={"/search"} 
                        prefetch={true}>
                        <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                        Search
                    </Link>

                    <hr />

                    { session 

                    ?

                    <div className="mt-auto flex flex-col mb-2">
                        <Link 
                            className={`navlink-ghost !w-full ${pathname === `/user/${session.user?.username}` ? "active" : null}`} 
                            href={`/user/${session.user?.username}`} 
                            prefetch={true}>
                            { session.user?.image ? <img className="w-5 h-5 mr-1 rounded-lg" src={session.user?.image} alt={"Your profile image."} /> : <UserIcon className="w-5 h-5 mr-1" /> }
                            {session.user?.username}
                        </Link>
                    </div>
                    
                    :

                    <div className="mt-auto gap-1 flex flex-col mb-2">
                        <Link 
                            className={`navlink-sidebar ${pathname === "/login" ? "active" : null}`} 
                            href={"/login"} 
                            prefetch={true}>
                            <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-1" />
                            Login
                        </Link>      

                        <Link 
                            className={`navlink-sidebar ${pathname === "/signup" ? "active" : null}`} 
                            href={"/signup"} 
                            prefetch={true}>
                            <UserPlusIcon className="w-5 h-5 mr-1" />
                            Signup
                        </Link>              
                    </div>
                    
                    }

                </motion.div>                
            </motion.div>

        </AnimatePresence> 

    )

}

export function BottombarItems() {

    const pathname = usePathname();

    return (

        <div className='max-w-full flex flex-row bg-[#0F0F0F] facebookTheme:bg-facebook_blue px-2 gap-2 w-full backdrop-blur-md transition-all sm:hidden fixed left-0 bottom-0 z-30'>
    
            <Link className={`bottombar-link ${pathname == "/" ? "active" : ""}`} href='/'><HomeIcon className="font-medium h-5 w-5" /><p>Home</p></Link>
            <Link className={`bottombar-link ${pathname == "/posts" ? "active" : ""}`} href='/posts'><ViewColumnsIcon className="font-medium h-5 w-5" /><p>Posts</p></Link>
            <Link className={`bottombar-link ${pathname == "/account" ? "active" : ""}`} href='/account'><UserIcon className="font-medium h-5 w-5" /><p>Account</p></Link>
            <Link className={`bottombar-link ${pathname == "/account/settings" ? "active" : ""}`} href='/account/settings'><Cog6ToothIcon className="font-medium h-5 w-5" /><p>Settings</p></Link>
    
        </div>
    
    );

}

export function TopbarItems() {

    const pathname = usePathname();
    const session = useSession();

    return (

        <div className='hidden lg:flex rounded-lg-full p-1'>

            { session ? 
                null
            : 
                <Link className={`topbar-link ${pathname == "/" ? "active" : ""}`} href='/'>Home</Link>
            }
            
            <Link className={`topbar-link ${pathname.startsWith("/posts") ? "active" : ""}`} href='/posts'>Posts</Link>   
            <Link className={`topbar-link ${pathname.startsWith("/c/") || pathname == "/c" ? "active" : ""}`} href='/c'>Community</Link>     
            <Link className={`topbar-link ${pathname.startsWith("/search") ? "active" : ""}`} href='/search'>Search</Link>

        </div>

    )

}

/**
 * @deprecated Use `CommunityInfobar` instead.
 */

export function CommunityInfobarItems( { community }: { community: Community } ) {

    return (

        <div>

            <div className='flex-row gap-2 rounded-lg-md w-full bg-transparent'>
                
                <div className='flex-col bg-card p-6 border-1 border-border rounded-lg-md'>

                    <div className='flex flex-row gap-3 items-center'>

                        <img src={community.image} className='h-[56px] rounded-lg' alt={`${community.display_name}'s Community Image`} />

                        <div className='flex flex-col'>

                            <h1 className='header-2'>{community.display_name}</h1>   
                            <h2 className='subtitle'>{community.description}</h2>

                        </div>

                    </div>

                    <div className='flex flex-row gap-3 items-center mt-2'>

                        <div className='flex flex-row gap-3'>

                            <div className='flex flex-row gap-1'>
                                <CalendarDaysIcon className='w-[20px]' />
                                <p className='text-sm'>{community.createdAt.toLocaleDateString()}</p>  
                            </div>
                            
                            <div className='flex flex-row gap-1'>
                                <UserIcon className='w-[20px]' />
                                <p className='text-sm'>---</p>
                            </div>

                            <div className='flex flex-row gap-1'>
                                <PencilSquareIcon className='w-[20px]' />
                                <p className='text-sm'>---</p>
                            </div>

                            <div className='flex flex-row gap-1'>
                                <ChatBubbleBottomCenterTextIcon className='w-[20px]' />
                                <p className='text-sm'>---</p>
                            </div>

                        </div>

                    </div>

                    <div className='flex flex-row gap-2 mt-3 mb-3'>

                        {/* @ts-ignore */}
                        <Link className='navlink justify-center items-center' href={`/c/${community.name}/rules`}><BookOpenIcon className="font-medium h-5 w-5" /><p className='flex items-center h-full'>Rules</p></Link>
                        {/* @ts-ignore */}
                        <Link className='navlink justify-center items-center' href={`/c/${community.name}/moderation`}><ShieldCheckIcon className="font-medium h-5 w-5" /><p className='flex items-center h-full'>Moderation</p></Link>    

                    </div>

                </div>

            </div>  

        </div>

    );

}

/**
 * ## CommunityInfobar
 * ---
 * Infobar of a community, shows all relevant information.
 * @param community
 */

export function CommunityInfobar( { community }: { community: Community } ) {

    const session = useSession();

    return (
        <div>
            <div className='flex-row gap-2 rounded-lg-md w-full bg-transparent'>
                <div className='flex justify-between bg-transparent border-0 border-border items-center'>
                    <div className='flex flex-row gap-3 items-center'>
                        <img src={community.image} className='h-[56px] rounded-lg' alt={`${community.name}'s Community Image`} />
                        <div className='flex flex-col'>
                            <h1 className='header-2'>{community.name}</h1>   
                            <h2 className='subtitle'>{community.description}</h2>
                        </div>
                    </div>

                    <div className='flex flex-row gap-2 h-fit'>
                        <JoinCommunityButton userID={session.user?.id} communityID={community.id} />
                    </div>
                </div>
            </div>  
        </div>
    );
}