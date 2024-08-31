"use client";

import { ArchiveBoxXMarkIcon, ArrowRightEndOnRectangleIcon, BookmarkIcon, ChevronUpIcon, Cog6ToothIcon, EllipsisVerticalIcon, MegaphoneIcon, ShareIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

import Dialog from "../components/dialog/dialog";
import LargeDropdown from "../components/large_dropdown";
import Menu, { MenuButton, MenuCustom, MenuLink, MenuShare, MenuUser } from "../components/menu/menu";
import Alert, { AlertSubtitle, AlertTitle } from "../components/new_alert";
import LogoutButton from "../components/signoutButton";

export default function DeveloperPage() {

    return (

        <div>
                <div className="flex flex-col border-0 border-border p-6 pt-12 lg:pb-12 lg:p-12 lg:px-48 bg-card mt-8 md:mt-0">
                    <h1 className="header">Design Page</h1>
                    <p className={`subtitle sm:hidden`}>List of all UI items in Command.</p>
                </div>

            <div className="flex flex-col px-6 lg:py-12 lg:px-48 mt-6 mb-6">
                    

                <div className="flex flex-col gap-2 mt-4">
                    <LargeDropdown title={"Buttons"} description={""}>

                        <h2 className="header-5 w-full mb-4">Normal</h2>

                        <button className={"navlink mb-4"}>normal</button>
                        <button className={"navlink small mb-4"}>normal small</button>

                        <button className={"navlink-full mb-4"}>full</button>
                        <button className={"navlink-full small mb-4"}>full small</button>

                        <button className={"navlink-destructive mb-4"}>destructive</button>
                        <button className={"navlink-destructive small mb-4"}>destructive small</button>

                        <button className={"navlink-emphasis mb-4"}>emphasis</button>
                        <button className={"navlink-emphasis small mb-4"}>emphasis small</button>

                        <button className={"navlink-ghost mb-4"}>ghost</button>
                        <button className={"navlink-ghost small mb-4"}>ghost small</button>
                        

                        <h2 className="header-5 w-full mb-4">Disabled</h2>

                        <button className={"navlink mb-4"} disabled>normal</button>
                        <button className={"navlink small mb-4"} disabled>normal small</button>

                        <button className={"navlink-full mb-4"} disabled>full</button>
                        <button className={"navlink-full small mb-4"} disabled>full small</button>

                        <button className={"navlink-destructive mb-4"} disabled>destructive</button>
                        <button className={"navlink-destructive small mb-4"} disabled>destructive small</button>

                        <button className={"navlink-emphasis mb-4"} disabled>emphasis</button>
                        <button className={"navlink-emphasis small mb-4"} disabled>emphasis small</button>

                        <button className={"navlink-ghost mb-4"} disabled>ghost</button>
                        <button className={"navlink-ghost small mb-4"} disabled>ghost small</button>

                    </LargeDropdown>
                </div>   

                <div className="flex flex-col gap-2 mt-4 w-full">
                    <LargeDropdown title={"Inputs"}>
                        <h2 className="header-5 w-full mb-4">Normal</h2>
                        <input className={"generic_field"} placeholder="This is an input."></input> 

                        <h2 className="header-5 w-full mb-4 mt-4">Error</h2>
                        <input className={"generic_field error"} placeholder="This is an input with an error."></input>
                    </LargeDropdown>                    
                </div>

                <div className="flex flex-col gap-2 mt-4 w-full">
                    <LargeDropdown title={"Alerts"}>

                        <div className="code-block mb-4">
                            type: &quot;notice&quot; | &quot;alert&quot; | &quot;success&quot; | &quot;error&quot;;<br />
                            style?: &quot;subtle&quot; | &quot;left-accent&quot; | &quot;top-accent&quot;;<br />
                            children: React.ReactNode;<br />
                            className?: string;<br />
                            closeBtn?: boolean;     
                        </div>
    
                        <h2 className="header-5 w-full mb-4">Notice</h2>
                        <Alert type={"notice"}>
                            <AlertTitle>Notice to all users.</AlertTitle>
                            <AlertSubtitle>The website will be down for maintenance from 9:00am to 14:30pm GMT.</AlertSubtitle>
                        </Alert>
                        <Alert type={"notice"} style={"left-accent"} className="mt-2">
                            <AlertTitle>Notice to all users.</AlertTitle>
                            <AlertSubtitle>The website will be down for maintenance from 9:00am to 14:30pm GMT.</AlertSubtitle>
                        </Alert>
                        <Alert type={"notice"} style={"top-accent"} className="mt-2">
                            <AlertTitle>Notice to all users.</AlertTitle>
                            <AlertSubtitle>The website will be down for maintenance from 9:00am to 14:30pm GMT.</AlertSubtitle>
                        </Alert>

                        <h2 className="header-5 w-full mb-4 mt-4">Alert</h2>
                        <Alert type={"alert"}>
                            <AlertTitle>Moderator Warning</AlertTitle>
                            <AlertSubtitle>You have been warned for violating community rules.</AlertSubtitle>
                        </Alert>
                        <Alert type={"alert"} style={"left-accent"} className="mt-2">
                            <AlertTitle>Moderator Warning</AlertTitle>
                            <AlertSubtitle>You have been warned for violating community rules.</AlertSubtitle>
                        </Alert>
                        <Alert type={"alert"} style={"top-accent"} className="mt-2">
                            <AlertTitle>Moderator Warning</AlertTitle>
                            <AlertSubtitle>You have been warned for violating community rules.</AlertSubtitle>
                        </Alert>

                        <h2 className="header-5 w-full mb-4 mt-4">Error</h2>
                        <Alert type={"error"}>
                            <AlertTitle>You have been banned from this community.</AlertTitle>
                            <AlertSubtitle>Reason: Violation of Rule 1 (Don&apos;t spam). Please contact the moderators if you wish to appeal.</AlertSubtitle>
                        </Alert>
                        <Alert type={"error"} style={"left-accent"} className="mt-2">
                            <AlertTitle>You have been banned from this community.</AlertTitle>
                            <AlertSubtitle>Reason: Violation of Rule 1 (Don&apos;t spam). Please contact the moderators if you wish to appeal.</AlertSubtitle>
                        </Alert>
                        <Alert type={"error"} style={"top-accent"} className="mt-2">
                            <AlertTitle>You have been banned from this community.</AlertTitle>
                            <AlertSubtitle>Reason: Violation of Rule 1 (Don&apos;t spam). Please contact the moderators if you wish to appeal.</AlertSubtitle>
                        </Alert>

                        <h2 className="header-5 w-full mt-4">Title Only</h2>
                        <p className="mb-4">Don&apos;t add `&lt;AlertSubtitle&gt;` as a child.</p>
                        <Alert type={"error"}>
                            <AlertTitle>Sorry, the settings failed to apply.</AlertTitle>
                        </Alert>

                        <h2 className="header-5 w-full mt-4">No Close Button</h2>
                        <p className="mb-4">Set the prop `closeBtn` to false.</p>
                        <Alert type={"error"} closeBtn={false}>
                            <AlertTitle>Sorry, the settings failed to apply.</AlertTitle>
                        </Alert>

                    </LargeDropdown>                    
                </div>

                <div className="flex flex-col gap-2 mt-4 w-full">
                    <LargeDropdown title={"Menus"}>

                        <p className="mb-2">Menu</p>
                        <div className="code-block mb-4">
                            defaultPlacement?: Placement;<br />
                            trigger: React.ReactNode;<br />
                            children: React.ReactNode;<br />
                            className?: string;
                        </div>

                        <p className="mb-2">MenuLink</p>
                        <div className="code-block mb-4">
                            text: string;<br />
                            icon?: React.ReactElement | null;<br />
                            link: Route&lt;T&gt; | URL;<br />
                        </div>

                        <p className="mb-2">MenuButton</p>
                        <div className="code-block mb-4">
                            text: string;<br />
                            icon?: React.ReactElement;<br />
                            onClick: MouseEventHandler&lt;HTMLButtonElement&gt;;<br />
                            destructive?: boolean;
                        </div>

                        <p className="mb-2">MenuItem</p>
                        <div className="code-block mb-4">
                            text: string;<br />
                            icon?: React.ReactElement | null;<br />
                        </div>

                        <p className="mb-2">MenuUser</p>
                        <div className="code-block mb-4">
                            MenuUser has no props
                        </div>

                        <p className="mb-2">MenuShare</p>
                        <div className="code-block mb-4">
                            title: string;<br />
                            text: string;<br />
                            url: string;<br />
                            icon: React.ReactElement;<br />
                        </div>

                        <p className="mb-2">MenuCustom</p>
                        <div className="code-block mb-4">
                            children: React.ReactNode | React.ReactElement;<br />
                            className?: string;
                        </div>

                        {/*<h2 className="header-5 w-full mb-4">Example: User Menu</h2>
                        <Menu>
                            <Menu.Trigger><button className="navlink">Click Me</button></Menu.Trigger>
                            <Menu.Content>
                                <MenuUser />
                                <hr className='mt-1 mb-1' />
                                <MenuLink text={"Saved Posts"} icon={<BookmarkIcon />} link={"/posts/saved"} />
                                <hr className='mt-1 mb-1' />
                                <MenuLink text={"Settings"} icon={<Cog6ToothIcon />} link={"/account/settings"} />
                                <LogoutButton className={"hover:bg-border w-full px-3 py-2 flex gap-2 items-center transition-all text-sm subtitle hover:!text-white rounded-lg"}><ArrowRightEndOnRectangleIcon className='w-5 h-5' />Logout</LogoutButton>
                                <hr className='mt-1 mb-1' />
                                <MenuCustom className={"hover:bg-card"}>
                                    <div className='flex flex-col gap-1 items-center w-full'>
                                        <Link className='label cursor-pointer hover:!text-white !text-xs subtitle' href={"https://github.com/CMD-Forum/cmd-forum"}><MegaphoneIcon className='w-4 h-4'/>New Update - Alpha 1.3</Link>              
                                    </div>
                                </MenuCustom>                                
                            </Menu.Content>
                        </Menu>*/}

                        <h2 className="header-5 w-full mb-4 mt-4">Example: Post Menu</h2>
                        <Menu>
                            <Menu.Trigger><button className="navlink !px-2"><EllipsisVerticalIcon className="w-5 h-5" /></button></Menu.Trigger>
                            <Menu.Content>
                                <MenuLink text={"User"} icon={<img src={"/images/favicon/favicon.svg"} alt={""}></img>} link={`/user`}></MenuLink>
                                <MenuLink text={"General"} icon={<img src={"/images/favicon/favicon.svg"} alt={""}></img>} link={`/c`}></MenuLink>
                                <hr className='mt-1 !mb-1'/>
                                <MenuShare icon={<ShareIcon />} text={"Share"} title={"Share the Command UI Page!"} url={"/dev"} />
                                {/* @ts-ignore */}
                                <MenuButton icon={<ArchiveBoxXMarkIcon />} text={"Delete"} destructive={true} />                                
                            </Menu.Content>
                        </Menu>  
                        <div className="mb-40" />

                    </LargeDropdown>                    
                </div>

                <div className="flex flex-col gap-2 mt-4 w-full">
                    <LargeDropdown title={"Dialogs"}>

                        <p className="mb-2">Dialog</p>
                        <div className="code-block mb-4">
                            children: React.ReactNode;<br />
                            openBtn?: boolean;<br />
                            openBtnComponent?: React.ReactElement;<br />
                            closeBtn?: boolean;<br />
                            closeBtnComponent?: React.ReactElement;
                        </div>

                        <p className="mb-2">DialogTitle</p>
                        <div className="code-block mb-4">
                            children: React.ReactNode;<br />
                            className?: string;<br />
                            ...other
                        </div>

                        <p className="mb-2">DialogSubtitle</p>
                        <div className="code-block mb-4">
                            children: React.ReactNode;<br />
                            className?: string;<br />
                            ...other
                        </div>

                        <p className="mb-2">DialogButton</p>
                        <div className="code-block mb-4">
                            children: React.ReactNode;<br />
                            className?: string;<br />
                            type: &quot;navlink&quot; | &quot;navlink-full&quot; | &quot;navlink-destructive&quot; | &quot;navlink-success&quot; | &quot;navlink-sidebar&quot;;<br />
                            loadingVariable?: any;<br />
                            spinnerColor: &quot;white&quot; | &quot;black&quot;;<br />
                            onClick?: MouseEventHandler&lt;HTMLButtonElement&gt;;<br />
                            ...other
                        </div>

                        <h2 className="header-5 w-full mb-4">Confirmation Dialog</h2>
                        <Dialog>
                            <Dialog.Trigger><button className="navlink">open</button></Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Title>Are you sure?</Dialog.Title>
                                <Dialog.Subtitle>If you&apos;re sure you want to do this, click yes.</Dialog.Subtitle>    
                                <Dialog.ButtonContainer>
                                    <button className={"navlink-full"}>Yes</button> 
                                </Dialog.ButtonContainer>                            
                            </Dialog.Content>
                        </Dialog>

                        <h2 className="header-5 w-full mb-4 mt-4">Confirmation Dialog w/ Close</h2>
                        
                        <Dialog>
                            <Dialog.Trigger><button className="navlink-destructive">Delete Post</button></Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Title>Delete this post?</Dialog.Title>
                                <Dialog.Subtitle>If you&apos;re sure you want to delete your post, click yes.</Dialog.Subtitle>
                                <Dialog.ButtonContainer>
                                    <Dialog.CloseButton><button className="navlink">Cancel</button></Dialog.CloseButton>
                                    <button className="navlink-destructive">Yes</button>
                                </Dialog.ButtonContainer>                                
                            </Dialog.Content>
                        </Dialog>

                        <h2 className="header-5 w-full mb-4 mt-4">Notice Dialog</h2>
                        <Dialog>
                            <Dialog.Trigger><button className="navlink"><ChevronUpIcon className="w-5 h-5" />Upvote</button></Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Title>This feature is unavailable.</Dialog.Title>
                                <Dialog.Subtitle>Sorry, this feature is currently unavailable.</Dialog.Subtitle>   
                                <Dialog.ButtonContainer>
                                    <Dialog.CloseButton><button className="navlink-full">Close</button></Dialog.CloseButton>
                                </Dialog.ButtonContainer>
                            </Dialog.Content>
                        </Dialog>

                    </LargeDropdown>                    
                </div>

                <div className="flex flex-col gap-2 mt-4 w-full">
                    <LargeDropdown title={"Posts"}>
                        <h2 className="header-5 w-full mb-4">Card Post (TBD)</h2>
                    </LargeDropdown>                    
                </div>

                <h2 className="header-5 mt-4 w-full">Debug</h2> 

                <div className="flex flex-col gap-2 mt-4">       
                    <p>No debug options available now - check back later.</p>
                </div>  

            </div>     

        </div>

    );

}