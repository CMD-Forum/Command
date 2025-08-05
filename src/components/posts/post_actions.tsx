"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth/auth-client";
import { CircleAlert, EllipsisVertical, MessageCircleMore, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ReportDialog from "./buttons/report_dialog";
import { SavePostButton } from "./buttons/save_post_button";
import ShareButton from "./buttons/share_button";
import VoteButton, { SignedOutVoteButton } from "./buttons/vote_button";

export default function PostActions({ postID, postTitle }: { postID: string, postTitle: string }) {
    const { data: SESSION } = authClient.useSession();
    const t = useTranslations("Components.Post");

    const [open, setOpen] = useState<boolean>(false);

    const isMobile = useIsMobile();
    
    return (
        <div className="flex flex-row mt-3 justify-between w-full">
            <div className="flex justify-between lg:!justify-start w-full">
                <div className="flex flex-row gap-2">
                    {SESSION?.user?.id
                        ?
                        <VoteButton
                            subjectID={postID}
                            subject="POST"
                        />
                        :
                        <SignedOutVoteButton postID={postID} />
                    }
                    <Button asChild variant="outline" size={isMobile ? "icon" : "default"}>
                        <a href={`/posts/${postID}`}>
                            <MessageCircleMore size={4} />
                            <span className={isMobile ? "hidden" : ""}>{t("Comments")}</span>
                        </a>
                    </Button>

                    <div className="hidden lg:!flex flex-row gap-2">
                        <ShareButton
                            title="Command" 
                            text={postTitle}
                            url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${postID}`}
                        />

                        <Button variant="outline" onClick={() => setOpen(!open)}>
                            <CircleAlert size={4} />
                            <span className={isMobile ? "hidden" : ""}>{t("ReportButton.ButtonReport")}</span>
                        </Button>

                        {SESSION?.user?.id &&
                            <SavePostButton
                                userID={SESSION.user.id}
                                postID={postID}
                            />
                        }
                    </div>
                </div>
                <div className="flex flex-row gap-2 lg:!hidden">
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
                                async () => await navigator.share({ title: "Command", text: postTitle, url: `${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${postID}` })}
                            >
                                <Share />
                                {t("Share.Share")}
                            </DropdownMenuItem>
                            {SESSION?.user?.id &&
                                <SavePostButton
                                    menuTrigger
                                    userID={SESSION.user.id}
                                    postID={postID}
                                />                         
                            }
                            <DropdownMenuItem onClick={() => setOpen(!open)} variant="destructive">
                                <CircleAlert />
                                {t("ReportButton.ButtonReport")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <ReportDialog open={open} setOpen={setOpen} subject="POST" subjectID={postID} reporterID={SESSION?.user?.id} />
        </div>
    );
}