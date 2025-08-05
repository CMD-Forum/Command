"use client";

import { authClient } from "@/lib/auth/auth-client";
import { logout } from "@/lib/logout";
import { ArrowLeftEndOnRectangleIcon, ArrowRightEndOnRectangleIcon, BookmarkIcon, BookmarkSlashIcon, ChevronDownIcon, ChevronLeftIcon, ExclamationCircleIcon, HomeIcon, PencilSquareIcon, Square2StackIcon, UserGroupIcon, UserIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProfileImage from "../account/ProfileImage";
import Button, { ButtonLink } from "../button/button";
import Dialog, { DialogButtonContainer, DialogCloseButton, DialogContent, DialogTrigger } from "../dialog/dialog";
import Menu, { MenuContent, MenuFormAction, MenuTrigger } from "../menu/menu";
import Typography from "../misc/typography";

function SidebarLink({ title, href, icon, isExpanded }: { title: string, href: string, icon: React.ReactElement, isExpanded: boolean }) {
    const PATHNAME = usePathname();

    return (
        <Link href={href} className={`flex items-center w-full ${isExpanded ? "px-4 justify-start" : "px-1 justify-center"} py-2 rounded transition-all hover:bg-border ${PATHNAME === href && "!bg-border"} group`}>
            {React.cloneElement(icon as React.ReactElement<Partial<{ className: string }>>, { className: `w-4 h-4 group-hover:text-white ${PATHNAME === href && "text-white"}` })}
            { isExpanded && <span className={`ml-2 text-sm font-semibold text-secondary group-hover:text-white ${PATHNAME === href && "text-white"}`}>{title}</span> }
        </Link>
    );
}

export default function Sidebar() {
    const { data: SESSION } = authClient.useSession();

    const [joinedCommunitiesExpanded, setJoinedCommunitiesExpanded] = useState<boolean>(true);
    const [joinedCommunities, setJoinedCommunities] = useState<{ name: string }[] | null>([]);
    const [joinedCommunitiesLoading, setJoinedCommunitiesLoading] = useState<boolean>(true);
    const [joinedCommunitiesError, setJoinedCommunitiesError] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean | null>(false);

    useEffect(() => {
        const SIDEBAR_OPENED = localStorage.getItem("sidebar_opened");

        if (SIDEBAR_OPENED === "false") setIsExpanded(false);
        else if (SIDEBAR_OPENED === "true") setIsExpanded(true);
    }, []);

    function setExpanded() {
        const NEW_STATE = !isExpanded;
        localStorage.setItem("sidebar_opened", NEW_STATE ? "true" : "false");
        setIsExpanded(NEW_STATE);
    }

    if (isExpanded === null) return <div className="w-[65px] h-screen sticky top-0 left-0 z-[999999] bg-border animate-pulse"></div>

    const COMMUNITY_COUNT = joinedCommunities?.length;
    const COMMUNITY_HEIGHT = (COMMUNITY_COUNT || 1) * 40;

    // const token = localStorage.getItem("bearer_token");

    useEffect(() => {
        setJoinedCommunitiesLoading(true);
        if (SESSION?.user?.id) {
            fetch("/api/v2/account/data/getJoinedCommunities", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (!res.ok) setJoinedCommunitiesError(true);
                return res.json();
            })
            .then((data) => {
                if (data.response) setJoinedCommunities(data.response.communities);
                else setJoinedCommunities(null);
            })
            .finally(() => setJoinedCommunitiesLoading(false));
        } else {
            setJoinedCommunitiesLoading(false);
        }
    }, [SESSION]);

    const t = useTranslations("Layout.Sidebar");

    const PATHNAME = usePathname();

    if (PATHNAME !== "/login" && PATHNAME !== "/signup") return (
        <div className={clsx("flex flex-col shrink-0 bg-background border-r p-4 border-border h-screen overflow-y-auto overflow-x-visible sticky top-0 left-0 z-[999999] justify-between", isExpanded ? "w-90" : "w-[65px]")}>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    { isExpanded && <Link href={"/"} className="text-2xl font-extrabold text-white !hidden lg:!flex">{"Command"}</Link> }
                    <Button variant="Ghost" icon={<ChevronLeftIcon className={isExpanded ? "rotate-0" : "rotate-180"} />} square onClick={() => setExpanded()} />
                </div>
                <div className="flex flex-col gap-2">
                    <SidebarLink title={t("Home")} href="/" icon={<HomeIcon />} isExpanded={isExpanded} />
                    <SidebarLink title={t("Communities")} href="/c" icon={<Square2StackIcon />} isExpanded={isExpanded} />
                    { SESSION?.user?.id && (
                        <>
                            <hr />
                            <SidebarLink title={t("SavedPosts")} href="/posts/saved" icon={<BookmarkIcon />} isExpanded={isExpanded} />
                        </>
                    )}
                    { SESSION?.user?.id && (
                        joinedCommunitiesLoading 
                            ? 
                                <div className="w-full h-9 bg-border animate-pulse transition-all rounded" />
                            :
                                <>
                                    <button onClick={() => setJoinedCommunitiesExpanded(!joinedCommunitiesExpanded)} className={`flex cursor-pointer items-center justify-start w-full px-4 py-2 rounded transition-all hover:bg-border group ${joinedCommunitiesExpanded && "!bg-border"}`}>
                                        <UserGroupIcon className={`w-4 h-4 group-hover:text-white ${joinedCommunitiesExpanded && "text-white"}`} />
                                        <span className={`ml-2 text-sm font-semibold text-secondary group-hover:text-white ${joinedCommunitiesExpanded && "text-white"}`}>{t("JoinedCommunities")}</span>
                                        <ChevronDownIcon className={`w-4 h-4 ml-auto group-hover:text-white ${joinedCommunitiesExpanded && "transform rotate-180"} transition-all`} />
                                    </button>
                                    <div 
                                        className={`pl-4 max-h-0 overflow-hidden border-l border-border transition-all`}
                                        style={{ maxHeight: joinedCommunitiesExpanded ? `${COMMUNITY_HEIGHT}px` : '0px' }}
                                    >
                                        {joinedCommunities && joinedCommunities.map((community: any) => {
                                            return (
                                                <SidebarLink title={community.name} href={`/c/${community.name}`} icon={<Square2StackIcon />} isExpanded={isExpanded} />
                                            );
                                        })}     
                                        {joinedCommunitiesError &&
                                            <div className="flex items-center gap-4 text-red-300">
                                                <ExclamationCircleIcon className="w-5 h-5" />
                                                <Typography variant="p" error>{t("JoinedCommunitiesError")}</Typography>
                                            </div>
                                        }
                                        {!joinedCommunities &&
                                            <div className="flex items-center gap-4 text-secondary">
                                                <BookmarkSlashIcon className="w-5 h-5" />
                                                <Typography variant="p" secondary>{t("NoCommunitiesJoined")}</Typography>
                                            </div>
                                        }
                                        {!joinedCommunities && <Typography variant="p" secondary>{t("NoCommunitiesJoined")}</Typography>}
                                    </div>                            
                                </>
                    )}                
                </div>            
            </div>
            { SESSION?.user?.id && (
                <div className="flex flex-row gap-2">
                    <Button variant="Ghost" icon={<PencilSquareIcon />} square className="shrink-0" />
                    <Menu>
                        <MenuTrigger>
                            <button className={`flex gap-4 cursor-pointer items-center justify-start w-full px-4 ${isExpanded ? "py-3" : "py-2"} rounded transition-all hover:bg-border group`}>
                                <ProfileImage user={SESSION.user} imgSize="5" measurement="units" className="rounded" />
                                { isExpanded && 
                                    <div className="flex flex-col justify-start items-start">
                                        <Typography variant="p">{SESSION.user?.username}</Typography>
                                        <Typography variant="p" className="!text-xs" secondary>{SESSION.user?.email}</Typography>                            
                                    </div>
                                }
                            </button>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuFormAction action={logout} destructive icon={<ArrowLeftEndOnRectangleIcon />}>{t("AccountMenu.LoggedIn.Logout")}</MenuFormAction>
                        </MenuContent>
                    </Menu>
                </div>
            )}
            { !SESSION?.user?.id && (
                <div className="flex flex-row gap-2">
                    <Dialog title={t("AccountMenu.LoggedOut.AccountTitle")} subtitle={t("AccountMenu.LoggedOut.AccountDescription")}>
                        <DialogTrigger>
                            <button className={`flex gap-4 cursor-pointer items-center w-full ${isExpanded ? "py-3 px-4 justify-start" : "py-2 px-1 justify-center"} rounded transition-all !bg-border group`}>
                                <UserIcon className="w-4 h-4" />
                                { isExpanded &&
                                    <div className="flex flex-col justify-start items-start">
                                        <Typography variant="p">{t("AccountMenu.LoggedOut.AccountTitle")}</Typography>
                                        <Typography variant="p" className="!text-xs" secondary>{t("AccountMenu.LoggedOut.AccountDescription")}</Typography>                            
                                    </div>                                
                                }
                            </button>
                        </DialogTrigger>
                        <DialogContent className="!z-[99999999]">
                            <DialogButtonContainer>
                                <DialogCloseButton><ButtonLink href={"/login"} variant="Secondary" icon={<ArrowRightEndOnRectangleIcon />}>{t("AccountMenu.LoggedOut.Login")}</ButtonLink></DialogCloseButton>
                                <DialogCloseButton><ButtonLink href={"/signup"} variant="Secondary" icon={<UserPlusIcon />}>{t("AccountMenu.LoggedOut.Signup")}</ButtonLink></DialogCloseButton>
                            </DialogButtonContainer>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}