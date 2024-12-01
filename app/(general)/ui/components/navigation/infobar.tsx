"use client";

import { CheckBadgeIcon, ClipboardDocumentCheckIcon, InformationCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import Accordion from "../accordion/accordion";

export default function Infobar() {

    const markdown = `# Command
    \nWelcome to Command. If this is your first time here, [signup](/signup) to get started. 
    \n ## Rules
    \n 1. Please don't spam.
    \n 2. Be respectful.
    \n 3. Nothing illegal, please
    \n ## Contributing
    \n If you want to contribute or fork Command, visit the GitHub repository [here](https://github.com/CMD-Forum/cmd-forum).`

    const pathname = usePathname();

    if (pathname.startsWith("/c/") || pathname.startsWith("/posts/")) {
        // Communitys have their own infobar, so this one isn't shown.
        return null;
    } else {

        const info_md = `Hello, and welcome to Command.\n
Below are the rules and site administrators.\n
If you want to post, you&apos;ll need to signup for an account, which can be done [here](/signup).`

        return (
            <>
                <nav className="hidden 2xl:flex sticky max-h-screen top-16" role="navigation">         
                    <div 
                        className={`bg-background p-4 hide-scrollbar overflow-x-hidden w-[300px] h-screen`}
                        role="navigation"
                        aria-label="Infobar"
                    >
                        <div className="overflow-y-auto overflow-x-hidden">
                            <div className="flex gap-2 items-center">
                                <h2 className="header-2 overflow-hidden whitespace-nowrap text-ellipsis">Command</h2>    
                            </div>
                            <div className="markdown-body mb-1">
                                <p>Command is a forum site for people to share news, interests or anything they can think of.</p>
                            </div>

                            {/*<div className='flex flex-row gap-3 items-center mt-2 mb-2'>
                                <div className='flex flex-row gap-3'>
                                    <div className='flex flex-row gap-1 items-center'>
                                        <CalendarDaysIcon className='w-[20px] text-gray-300' />
                                        <p className='subtitle'>{community.createdAt.toLocaleDateString()}</p>  
                                    </div>
                                    
                                    <div className='flex flex-row gap-1 items-center'>
                                        <UserIcon className='w-[20px] text-gray-300' />
                                        <MemberCount communityID={community.id} />
                                    </div>

                                    <div className='flex flex-row gap-1 items-center'>
                                        <PencilSquareIcon className='w-[20px] text-gray-300' />
                                        <PostCount communityID={community.id} />
                                    </div>

                                    <div className='flex flex-row gap-1 items-center'>
                                        <ChatBubbleBottomCenterTextIcon className='w-[20px] text-gray-300' />
                                        <p className='subtitle'>---</p>
                                    </div>
                                </div>
                            </div>*/}

                            {/*<div className="flex gap-1 mt-4 mb-4">
                                {session &&
                                    <JoinCommunityButton communityID={community.id} userID={session.user?.id} />
                                }
                                <Dialog>
                                    <Dialog.Trigger><button className="navlink !px-2"><ShieldCheckIcon className="w-5 h-5" /></button></Dialog.Trigger>
                                    <Dialog.Content>
                                        <Dialog.Title>Moderation Logs</Dialog.Title>
                                        <Dialog.Subtitle>c/{community.name}</Dialog.Subtitle>
                                        <Dialog.DialogBody>
                                            <ModlogList communityId={community.id} />
                                        </Dialog.DialogBody>
                                        <Dialog.ButtonContainer>
                                            <Dialog.CloseButton><button className="navlink-full">Close</button></Dialog.CloseButton>
                                        </Dialog.ButtonContainer>
                                    </Dialog.Content>
                                </Dialog>
                            </div>*/}

                            <div className="mt-4" />

                            <Accordion title="Information" icon={<InformationCircleIcon />}>
                                <div className="markdown-body">
                                    <Markdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>{info_md}</Markdown>    
                                </div>
                            </Accordion>

                            <Accordion title="Site Rules" icon={<ClipboardDocumentCheckIcon />}>
                                <div className="flex flex-col gap-1">
                                    <p className="subtitle">1. Do not post illegal content, you will be banned.</p>
                                    <p className="subtitle">2. Do not spam, you will be banned.</p>
                                    <p className="subtitle">3. Do not constantly harass users without reason (arguments are permitted).</p>
                                    <p className="subtitle">4. Follow community rules when interacting.</p>
                                    <p className="subtitle">5. Do not claim others work as your own.</p>
                                    <p className="subtitle">6. Do not <Link href={"https://en.wikipedia.org/wiki/Doxing"} className="underline hover:no-underline">doxx</Link> people on Command.</p>
                                    <p className="subtitle">7. Do not break Command or use exploits to your advantage. Instead, report them on GitHub.</p>
                                </div>
                            </Accordion>

                            <Accordion title="Site Administrators" icon={<CheckBadgeIcon />}>
                                {/*{community.admins.length > 0 ?
                                    <div className="mt-1">
                                        {community.admins.map((admin: any) => {
                                            return (
                                                <div className="flex flex-col gap-4" key={admin.userId || admin}>
                                                    <div className="hover:bg-card active:bg-card border-0 border-border rounded flex flex-col gap-1 w-full transition-all">
                                                        <div className="flex gap-2">
                                                            <ProfileImage user={admin.user} imgSize={"5"} />
                                                            <Link href={`/user/${admin.user.username}`} className="transition-all subtitle hover:!text-white">{admin.user.username}</Link>                                        
                                                        </div>
                                                        <p>Since the {dayjs(admin.createdAt).format("Do [of] MMMM[,] YYYY")}.</p>
                                                    </div>
                                                </div>
                                            );
                                        })}                                      
                                    </div>
                                :
                                    <p>This community has no administrators.</p>
                                }*/}
                                <p>Site Administrators are currently unimplemented.</p>
                            </Accordion>
                        </div>
                    </div>                     
                </nav>
            </>
        );
    }
}