"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth/auth-client";
import dayjs from "@/lib/dayjs";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, EllipsisVertical, ExternalLink, MessageCircleMore, MessageCircleX, Share, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import DeletePostDialog from "./buttons/delete_post_dialog";
import ReportDialog from "./buttons/report_dialog";
import { SavePostButton } from "./buttons/save_post_button";
import ShareButton from "./buttons/share_button";
import VoteButton, { SignedOutVoteButton } from "./buttons/vote_button";

export default function PostActions({ 
    postInformation 
}: { 
    postInformation: { 
        id: string;
        title: string;
        author: {
            id: string;
            username: string;
            image: string | null;
            createdAt: Date;
            isModerator: boolean;
        },
        community: {
            name: string;
            image: string | null;
            createdAt: Date;
            description: string | null;
        }
    } 
}) {
    const { data: SESSION } = authClient.useSession();
    const t = useTranslations("Components.Post");

    const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const isMobile = useIsMobile();

    const [saved, setSaved] = useState(false);

    // Annoying that I had to do this but this was the easiest way to synchronise the saved state
    useQuery({
        queryKey: ['save_post', postInformation.id, SESSION?.user.id],
        queryFn: async () => {
            if (!SESSION?.user.id) return;

            const res = await fetch(`/api/posts/checkSaved/${postInformation.id}`);
            if (!res.ok) return;
            const data = await res.json();
            setSaved(data === true);
            return data;
        }
    });
    
    return (
        <div className="flex flex-row mt-3 justify-between w-full">
            <div className="flex justify-between lg:!justify-start w-full">
                <div className="flex flex-row gap-2">
                    {SESSION?.user?.id
                        ?
                        <VoteButton
                            subjectID={postInformation.id}
                            subject="POST"
                        />
                        :
                        <SignedOutVoteButton postID={postInformation.id} />
                    }
                    <Button asChild variant="outline" size={isMobile ? "icon" : "default"}>
                        <a href={`/posts/${postInformation.id}`}>
                            <MessageCircleMore size={4} />
                            <span className={isMobile ? "hidden" : ""}>{t("Comments")}</span>
                        </a>
                    </Button>

                    <div className="hidden lg:!flex flex-row gap-2">
                        <ShareButton
                            title="Command" 
                            text={postInformation.title}
                            url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${postInformation.id}`}
                        />

                        <Button variant="outline" onClick={() => setReportDialogOpen(!reportDialogOpen)}>
                            <CircleAlert size={4} />
                            <span className={isMobile ? "hidden" : ""}>{t("ReportButton.ButtonReport")}</span>
                        </Button>

                        {SESSION?.user?.id &&
                            <SavePostButton
                                userID={SESSION.user.id}
                                postID={postInformation.id}
                                saved={saved} 
                                setSaved={setSaved}
                            />
                        }
                    </div>
                </div>
                <div className="flex flex-row gap-2 lg:!hidden">
                    { isMobile ?
                        <Drawer shouldScaleBackground setBackgroundColorOnScale={false}>
                            <DrawerTrigger>
                                <Button variant="outline" size="icon">
                                    <EllipsisVertical size={4} />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className="hidden">
                                    <DrawerTitle>{t("More")}</DrawerTitle>
                                    <DrawerDescription>{t("MoreDrawerDescription")}</DrawerDescription>
                                </DrawerHeader>
                                <DrawerFooter className="!gap-1">
                                    <Link href={`/u/${postInformation.author.username}`} className="flex items-center gap-3 bg-input w-full h-fit p-3 rounded-sm hover:bg-input/60 transition-all">
                                        <Avatar>
                                            <AvatarImage src={postInformation.author.image || undefined} />
                                            <AvatarFallback>{postInformation.author.username.slice(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{postInformation.author.username}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{t("Joined")} {dayjs(postInformation.author.createdAt).format("MMMM D, YYYY")}</p>
                                        </div>
                                        <div className="ml-auto" />
                                        <ExternalLink className="text-muted-foreground size-4" />
                                    </Link>
                                    <Link href={`/c/${postInformation.community.name}`} className="flex items-center gap-3 bg-input w-full h-fit p-3 rounded-sm mb-2 hover:bg-input/60 transition-all">
                                        <Avatar>
                                            <AvatarImage src={postInformation.community.image || undefined} />
                                            <AvatarFallback>{postInformation.community.name.slice(0,1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{postInformation.community.name}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{postInformation.community.description || t("Created") + " " + dayjs(postInformation.author.createdAt).format("MMMM D, YYYY") }</p>
                                        </div>
                                        <div className="ml-auto" />
                                        <ExternalLink className="text-muted-foreground size-4" />
                                    </Link>
                                    {SESSION?.user?.id &&
                                        <SavePostButton
                                            menuTrigger
                                            userID={SESSION.user.id}
                                            postID={postInformation.id}
                                            saved={saved} 
                                            setSaved={setSaved}
                                        />
                                    }
                                    <Button 
                                        onClick={async () => await navigator.share({ title: "Command", text: postInformation.title, url: `${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${postInformation.id}` })}
                                        variant="ghost" 
                                        className="!justify-start !font-medium"
                                    >
                                        <Share />
                                        {t("Share.Share")}
                                    </Button>
                                    <Button onClick={() => setReportDialogOpen(!reportDialogOpen)} variant="ghost" className="!justify-start !font-medium"><CircleAlert />{t("ReportButton.ButtonReportLong")}</Button>
                                    { 
                                        ((postInformation.author.id === SESSION?.user.id) || (postInformation.author.isModerator === true))
                                        &&
                                        <hr className="mt-2 mb-2" />
                                    }
                                    { postInformation.author.id === SESSION?.user.id && <Button onClick={() => setDeleteDialogOpen(!deleteDialogOpen)} variant="ghost" className="!justify-start !font-medium !ring-destructive/60"><Trash />{t("DeleteActions.Delete")}</Button> }
                                    { postInformation.author.isModerator === true && <Button onClick={() => console.log("Delete (as moderator) button pressed")} variant="ghost" className="!justify-start !font-medium !ring-destructive/60"><MessageCircleX />{t("DeleteActions.Delete")} {postInformation.author.id === SESSION?.user.id ? t("DeleteActions.AsModerator") : null}</Button> }
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    :
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <EllipsisVertical size={4} />    
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{t("More")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={
                                    async () => await navigator.share({ title: "Command", text: postInformation.title, url: `${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${postInformation.id}` })}
                                >
                                    <Share />
                                    {t("Share.Share")}
                                </DropdownMenuItem>
                                {SESSION?.user?.id &&
                                    <SavePostButton
                                        menuTrigger
                                        userID={SESSION.user.id}
                                        postID={postInformation.id}
                                        saved={saved} 
                                        setSaved={setSaved}
                                    />
                                }
                                <DropdownMenuItem onClick={() => setReportDialogOpen(!open)} variant="destructive">
                                    <CircleAlert />
                                    {t("ReportButton.ButtonReport")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>                    
                    }

                </div>
            </div>
            <ReportDialog open={reportDialogOpen} setOpen={setReportDialogOpen} subject="POST" subjectID={postInformation.id} reporterID={SESSION?.user?.id} />
            <DeletePostDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} postID={postInformation.id} />
        </div>
    );
}