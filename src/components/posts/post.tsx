"use client";

import { ArchiveBoxXMarkIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { EllipsisVerticalIcon, ShareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import dayjs from "@/lib/dayjs";

import Image from "@/components/misc/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth/auth-client";
import useFetch from "@/lib/hooks/data/useFetch";
import { Post as PostType } from "@prisma/client";
import { useTranslations } from "next-intl";
import ProfileImage from "../account/ProfileImage";
import Button from "../button/button";
import Checkbox from "../checkbox/checkbox";
import Dialog from "../dialog/dialog";
import Menu, { MenuButton, MenuLink, MenuShare } from "../menu/menu";
import Typography from "../misc/typography";
import { SavePostButton } from "../posts/buttons/save_post_button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { DeleteAsAuthorButton } from "./buttons/delete_button";
import ReportDialog from "./buttons/report_dialog";
import VoteButton from "./buttons/vote_button";
import CommentList from "./comments/comment_list";
import CreateComment from "./comments/create_comment";
import OpengraphDisplay from "./og_display";
import PostActions from "./post_actions";

/**
 * CardPost
 * ---
 * Horizontal card display of the given post.
 *
 *
 * @example
 * <CardPost
 *  id={post.id}
 *  title={post.title}
 *  author={post.author}
 *  community={post.community}
 *  upvotes={post.upvotes}
 *  downvotes={post.downvotes}
 *  createdAt={post.createdAt}
 *  updatedAt={post.updatedAt}
 *  public={post.public}
 *  tagline={post.tagline}
 *  content={post.content}
 *  imageurl={post.imageurl}
 *  imagealt={post.imagealt}
 * />
 *
 * @param post
 */

export function Post(post: Partial<PostType> & { 
    id: string, 
    title: string,
    createdAt: string,
    community: { 
        id: string,
        name: string,
    },
    author: {
        id: string,
        username: string;
    },
    view?: "Card" | "Compact"
}) {

    const { data: SESSION } = authClient.useSession();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const { data: isModerator } = useFetch<string | boolean>({ url: "/api/community/moderation/isModerator", bodyParams: {"userID": `${post.author.id}`, "communityID": `${post.communityId}`}});
    const t = useTranslations("Components.Post");

    return (
        <div className="flex flex-col w-full items-center md:gap-4 relative group transition-all bg-grey-one border-0 border-border group-hover/title:!border-white h-fit rounded-sm p-6" aria-label={t("Post")}>
            <div className="flex w-full bg-transparent h-fit flex-row items-center">
                {post.imageurl
                    ?
                        <Image
                            width={104}
                            height={104}
                            src={post.imageurl}
                            alt={post.imagealt!}
                            className={"rounded-sm flex max-w-16 min-w-16 h-16 lg:!max-w-[104px] lg:!min-w-[104px] lg:!h-[104px] mr-6 overflow-hidden bg-cover"} 
                            priority
                            placeholder="blur"
                            blurDataURL={post.imageblur || "L01.:8of00R%j[fQayfQRiayt7of"}
                            loading="eager"
                        />
                    :
                        <Image
                            width={104}
                            height={104}
                            src={"/TextPostFallback.png"} 
                            alt={"This post has no image."} 
                            className={"rounded-sm flex max-w-16 min-w-16 h-16 lg:!max-w-[104px] lg:!min-w-[104px] lg:!h-[104px] mr-6 overflow-hidden bg-cover"} 
                            priority
                            placeholder="blur"
                            blurDataURL={"L01.:8of00R%j[fQayfQRiayt7of"}
                            loading="eager"
                        />
                }
                <div className="w-full h-fit justify-center flex flex-col">
                    <div className="text-sm z-20 w-fit flex flex-col">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-2 items-center justify-center">
                                <div className="flex flex-col">
                                    <Typography variant="p" className="hover:underline w-fit !text-xs hover:!text-white transition-all" secondary><Link href={`/c/${post.community.name}`}>{"c/"}{post.community.name}</Link></Typography>
                                    { ! post.author ?
                                        <div>
                                            <Typography variant="p" className="hover:underline flex gap-1 !text-xs hover:!text-white transition-all" secondary>{"[deleted]"}</Typography> 
                                            <Typography variant="p" className="!text-xs" secondary>{"•"}</Typography> 
                                            <Typography variant="p" className="!text-xs" secondary>{dayjs(post.createdAt).fromNow()}</Typography>
                                        </div>
                                        :
                                        <div className="hidden md:flex flex-row gap-1">  
                                            <Link href={`/user/${post.author.username}`} className="p hover:underline !text-xs !text-secondary hover:!text-white transition-all">{"@"}{post.author.username}</Link>
                                            <Typography variant="p" className="!text-xs" secondary>{"•"}</Typography> 
                                            <Typography variant="p" className="!text-xs transition-all" secondary>{dayjs(post.createdAt).fromNow()}</Typography>
                                        </div>
                                    }                                                                                                
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Link href={`/posts/${post.id}`} className="!text-secondary hover:!text-white w-fit font-display font-semibold text-base lg:!text-[16px] transition-all">{post.title}</Link>

                    {post.href &&
                        <div className="mt-2">
                            <OpengraphDisplay url={post.href} />
                        </div>
                    }

                    {/*<p className="subtitle">{post.tagline}</p>*/}

                    <Dialog.Controlled
                        title={t("DeleteDialog.Title")}
                        subtitle={t("DeleteDialog.Subtitle")}
                        icon={true}
                        isOpen={deleteDialogOpen}
                        setIsOpen={setDeleteDialogOpen}
                    >
                        <Dialog.Content>
                            {isModerator && <Checkbox label={t("DeleteDialog.ModeratorLabel")} /> }
                            <Dialog.ButtonContainer>
                                <Dialog.CloseButton><Button variant="Secondary">{t("DeleteDialog.Cancel")}</Button></Dialog.CloseButton>
                                {SESSION?.user?.id === post.author.id && <DeleteAsAuthorButton postID={post.id}/> }
                            </Dialog.ButtonContainer>
                        </Dialog.Content>
                    </Dialog.Controlled>
                    <div className="hidden lg:flex w-full">
                        <PostActions postID={post.id} postTitle={post.title} />
                    </div>
                </div>
            </div>
            <div className="flex w-full lg:!hidden">
                <PostActions postID={post.id} postTitle={post.title} />
            </div>
        </div>
    )
}

export function PostNew(post: Partial<PostType> & { 
    id: string, 
    title: string,
    createdAt: string,
    updatedAt: string,
    community: { 
        id: string,
        name: string,
    },
    author: {
        id: string,
        username: string;
    },
    view?: "Card" | "Compact"
}) {

    const { data: SESSION } = authClient.useSession();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const { data: isModerator } = useFetch<string | boolean>({ url: "/api/community/moderation/isModerator", bodyParams: {"userID": `${post.author.id}`, "communityID": `${post.communityId}`}});
    const t = useTranslations("Components.Post");
    const isMobile = useIsMobile();

    return (
        <Card className={`!flex-row !gap-0 ${isMobile && "px-6"}`}>
            { !isMobile &&
                <CardContent>
                    <Image 
                        src={post.imageurl || "/TextPostFallback.svg"} 
                        width={100} 
                        height={100} 
                        alt="Post Image" 
                        className="!rounded-sm !object-cover" 
                        priority
                        quality={1}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI-CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjMjIyMjI1Ii8-CjxwYXRoIGQ9Ik0yMTguNjE0IDMwMy40NTVWMjk3LjQ4OUMyMTguNjE0IDI4My44MTcgMjE5LjY5MSAyNzIuOTIxIDIyMS44NDUgMjY0LjhDMjI0IDI1Ni42OCAyMjcuMTkgMjUwLjE3NiAyMzEuNDE1IDI0NS4yODdDMjM1LjY0MSAyNDAuMzE1IDI0MC44MiAyMzUuODQxIDI0Ni45NTIgMjMxLjg2NEMyNTIuMjU1IDIyOC4zODQgMjU2Ljk3OCAyMjUuMDI4IDI2MS4xMjEgMjIxLjc5NkMyNjUuMzQ3IDIxOC41NjUgMjY4LjY2MSAyMTUuMTI2IDI3MS4wNjQgMjExLjQ4QzI3My41NSAyMDcuODM0IDI3NC43OTMgMjAzLjY5MSAyNzQuNzkzIDE5OS4wNTFDMjc0Ljc5MyAxOTQuOTA4IDI3My43OTggMTkxLjI2MiAyNzEuODEgMTg4LjExNEMyNjkuODIxIDE4NC45NjUgMjY3LjEyOCAxODIuNTIxIDI2My43MzEgMTgwLjc4MUMyNjAuMzM0IDE3OS4wNCAyNTYuNTYzIDE3OC4xNyAyNTIuNDIgMTc4LjE3QzI0Ny45NDYgMTc4LjE3IDI0My44MDMgMTc5LjIwNiAyMzkuOTkxIDE4MS4yNzhDMjM2LjI2MyAxODMuMzQ5IDIzMy4yMzggMTg2LjIwOCAyMzAuOTE4IDE4OS44NTRDMjI4LjY4MSAxOTMuNSAyMjcuNTYyIDE5Ny43MjUgMjI3LjU2MiAyMDIuNTMxSDE2My45MjZDMTY0LjA5MiAxODQuMzAyIDE2OC4yMzUgMTY5LjUxMiAxNzYuMzU1IDE1OC4xNkMxODQuNDc1IDE0Ni43MjUgMTk1LjI0NyAxMzguMzU2IDIwOC42NyAxMzMuMDUzQzIyMi4wOTQgMTI3LjY2NyAyMzYuODQzIDEyNC45NzQgMjUyLjkxOCAxMjQuOTc0QzI3MC42NSAxMjQuOTc0IDI4Ni40NzYgMTI3LjU4NSAzMDAuMzk2IDEzMi44MDVDMzE0LjMxNyAxMzcuOTQyIDMyNS4yOTYgMTQ1LjczMSAzMzMuMzMzIDE1Ni4xNzFDMzQxLjM3MSAxNjYuNTI5IDM0NS4zODkgMTc5LjQ5NiAzNDUuMzg5IDE5NS4wNzRDMzQ1LjM4OSAyMDUuMSAzNDMuNjQ5IDIxMy45MjQgMzQwLjE2OSAyMjEuNTQ4QzMzNi43NzIgMjI5LjA4OCAzMzIuMDA3IDIzNS43NTggMzI1Ljg3NiAyNDEuNTU4QzMxOS44MjcgMjQ3LjI3NiAzMTIuNzQyIDI1Mi40OTYgMzA0LjYyMiAyNTcuMjE5QzI5OC42NTYgMjYwLjY5OSAyOTMuNjQzIDI2NC4zMDMgMjg5LjU4MyAyNjguMDMyQzI4NS41MjMgMjcxLjY3OCAyODIuNDU3IDI3NS44NjIgMjgwLjM4NiAyODAuNTg1QzI3OC4zMTQgMjg1LjIyNSAyNzcuMjc4IDI5MC44NiAyNzcuMjc4IDI5Ny40ODlWMzAzLjQ1NUgyMTguNjE0Wk0yNDguOTQgMzg2Ljk3N0MyMzkuMzI5IDM4Ni45NzcgMjMxLjA4NCAzODMuNjIxIDIyNC4yMDcgMzc2LjkxQzIxNy40MTIgMzcwLjExNSAyMTQuMDU2IDM2MS44NzEgMjE0LjEzOSAzNTIuMTc2QzIxNC4wNTYgMzQyLjczIDIxNy40MTIgMzM0LjY1MSAyMjQuMjA3IDMyNy45NEMyMzEuMDg0IDMyMS4yMjggMjM5LjMyOSAzMTcuODcyIDI0OC45NCAzMTcuODcyQzI1OC4wNTUgMzE3Ljg3MiAyNjYuMDkyIDMyMS4yMjggMjczLjA1MyAzMjcuOTRDMjgwLjA5NiAzMzQuNjUxIDI4My42NTkgMzQyLjczIDI4My43NDEgMzUyLjE3NkMyODMuNjU5IDM1OC42MzkgMjgxLjk2IDM2NC41MjIgMjc4LjY0NiAzNjkuODI1QzI3NS40MTQgMzc1LjA0NSAyNzEuMTg4IDM3OS4yMyAyNjUuOTY4IDM4Mi4zNzlDMjYwLjc0OCAzODUuNDQ0IDI1NS4wNzIgMzg2Ljk3NyAyNDguOTQgMzg2Ljk3N1oiIGZpbGw9IndoaXRlIi8-CjxwYXRoIGQ9Ik0yMTguNjE0IDMwMy40NTVWMjk3LjQ4OUMyMTguNjE0IDI4My44MTcgMjE5LjY5MSAyNzIuOTIxIDIyMS44NDUgMjY0LjhDMjI0IDI1Ni42OCAyMjcuMTkgMjUwLjE3NiAyMzEuNDE1IDI0NS4yODdDMjM1LjY0MSAyNDAuMzE1IDI0MC44MiAyMzUuODQxIDI0Ni45NTIgMjMxLjg2NEMyNTIuMjU1IDIyOC4zODQgMjU2Ljk3OCAyMjUuMDI4IDI2MS4xMjEgMjIxLjc5NkMyNjUuMzQ3IDIxOC41NjUgMjY4LjY2MSAyMTUuMTI2IDI3MS4wNjQgMjExLjQ4QzI3My41NSAyMDcuODM0IDI3NC43OTMgMjAzLjY5MSAyNzQuNzkzIDE5OS4wNTFDMjc0Ljc5MyAxOTQuOTA4IDI3My43OTggMTkxLjI2MiAyNzEuODEgMTg4LjExNEMyNjkuODIxIDE4NC45NjUgMjY3LjEyOCAxODIuNTIxIDI2My43MzEgMTgwLjc4MUMyNjAuMzM0IDE3OS4wNCAyNTYuNTYzIDE3OC4xNyAyNTIuNDIgMTc4LjE3QzI0Ny45NDYgMTc4LjE3IDI0My44MDMgMTc5LjIwNiAyMzkuOTkxIDE4MS4yNzhDMjM2LjI2MyAxODMuMzQ5IDIzMy4yMzggMTg2LjIwOCAyMzAuOTE4IDE4OS44NTRDMjI4LjY4MSAxOTMuNSAyMjcuNTYyIDE5Ny43MjUgMjI3LjU2MiAyMDIuNTMxSDE2My45MjZDMTY0LjA5MiAxODQuMzAyIDE2OC4yMzUgMTY5LjUxMiAxNzYuMzU1IDE1OC4xNkMxODQuNDc1IDE0Ni43MjUgMTk1LjI0NyAxMzguMzU2IDIwOC42NyAxMzMuMDUzQzIyMi4wOTQgMTI3LjY2NyAyMzYuODQzIDEyNC45NzQgMjUyLjkxOCAxMjQuOTc0QzI3MC42NSAxMjQuOTc0IDI4Ni40NzYgMTI3LjU4NSAzMDAuMzk2IDEzMi44MDVDMzE0LjMxNyAxMzcuOTQyIDMyNS4yOTYgMTQ1LjczMSAzMzMuMzMzIDE1Ni4xNzFDMzQxLjM3MSAxNjYuNTI5IDM0NS4zODkgMTc5LjQ5NiAzNDUuMzg5IDE5NS4wNzRDMzQ1LjM4OSAyMDUuMSAzNDMuNjQ5IDIxMy45MjQgMzQwLjE2OSAyMjEuNTQ4QzMzNi43NzIgMjI5LjA4OCAzMzIuMDA3IDIzNS43NTggMzI1Ljg3NiAyNDEuNTU4QzMxOS44MjcgMjQ3LjI3NiAzMTIuNzQyIDI1Mi40OTYgMzA0LjYyMiAyNTcuMjE5QzI5OC42NTYgMjYwLjY5OSAyOTMuNjQzIDI2NC4zMDMgMjg5LjU4MyAyNjguMDMyQzI4NS41MjMgMjcxLjY3OCAyODIuNDU3IDI3NS44NjIgMjgwLjM4NiAyODAuNTg1QzI3OC4zMTQgMjg1LjIyNSAyNzcuMjc4IDI5MC44NiAyNzcuMjc4IDI5Ny40ODlWMzAzLjQ1NUgyMTguNjE0Wk0yNDguOTQgMzg2Ljk3N0MyMzkuMzI5IDM4Ni45NzcgMjMxLjA4NCAzODMuNjIxIDIyNC4yMDcgMzc2LjkxQzIxNy40MTIgMzcwLjExNSAyMTQuMDU2IDM2MS44NzEgMjE0LjEzOSAzNTIuMTc2QzIxNC4wNTYgMzQyLjczIDIxNy40MTIgMzM0LjY1MSAyMjQuMjA3IDMyNy45NEMyMzEuMDg0IDMyMS4yMjggMjM5LjMyOSAzMTcuODcyIDI0OC45NCAzMTcuODcyQzI1OC4wNTUgMzE3Ljg3MiAyNjYuMDkyIDMyMS4yMjggMjczLjA1MyAzMjcuOTRDMjgwLjA5NiAzMzQuNjUxIDI4My42NTkgMzQyLjczIDI4My43NDEgMzUyLjE3NkMyODMuNjU5IDM1OC42MzkgMjgxLjk2IDM2NC41MjIgMjc4LjY0NiAzNjkuODI1QzI3NS40MTQgMzc1LjA0NSAyNzEuMTg4IDM3OS4yMyAyNjUuOTY4IDM4Mi4zNzlDMjYwLjc0OCAzODUuNDQ0IDI1NS4wNzIgMzg2Ljk3NyAyNDguOTQgMzg2Ljk3N1oiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzIpIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfMiIgeDE9IjI1NiIgeTE9IjQ0IiB4Mj0iMjU2IiB5Mj0iNDY4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI-CjxzdG9wIHN0b3Atb3BhY2l0eT0iMCIvPgo8c3RvcCBvZmZzZXQ9IjAuNjAyNTM2IiBzdG9wLW9wYWNpdHk9IjAuOSIvPgo8c3RvcCBvZmZzZXQ9IjAuNzAxNTU0IiBzdG9wLW9wYWNpdHk9IjAuOTUiLz4KPHN0b3Agb2Zmc2V0PSIxIi8-CjwvbGluZWFyR3JhZGllbnQ-CjwvZGVmcz4KPC9zdmc-Cg"
                    />
                </CardContent>            
            }
            <div className="flex flex-col justify-between items-start !w-full">
                {isMobile ?
                    <Label className="text-muted-foreground mb-2">
                        <span className="flex items-center gap-x-1 text-[13px]">
                            {" " + dayjs(post.createdAt).fromNow() + " "}
                            {t("To")}
                            <a href={`/c/${post.community.name}`} className="text-primary hover:underline">
                                c/{post.community.name}
                            </a>
                        </span>
                    </Label>
                :
                    <Label className="text-muted-foreground">
                        <span className="flex items-center gap-x-1 text-[13px]">
                            {t("Submitted")}
                            {" " + dayjs(post.createdAt).fromNow() + " "}
                            {t("By")}
                            <a href={`/u/${post.author.username}`} className="text-primary hover:underline">
                                u/{post.author.username}
                            </a>
                            {t("To")}
                            <a href={`/c/${post.community.name}`} className="text-primary hover:underline">
                                c/{post.community.name}
                            </a>
                        </span>
                    </Label>
                }
                <CardTitle className={`leading-tight ${isMobile ? "mb-2" : ""}`}><a href={`/posts/${post.id}`}>{post.title}</a></CardTitle>
                <CardFooter className="!h-fit !px-0 !w-full">
                    <PostActions postID={post.id} postTitle={post.title} />
                </CardFooter>                
            </div>
        </Card>
    )
}

/**
 * ## FullPost
 * ---
 * Full display of the given post.
 * 
 * @param {string} id ID of the post.
 * @param {Date} createdAt When the post was created.
 * @param {Date} updatedAt When the post was updated in the database.
 * @param {string} title Title of the post.
 * @param {string} content Main content of the post.
 * @param {string} imageurl URL of the posts image, may be undefined or null.
 * @param {string} imagealt Alt tag of the posts image, may be undefined or null.
 * @param {boolean} public Whether the post is public or not.
 * @param {string} authorId The ID of the posts author.
 * @param {number} downvotes How many downvotes the post has.
 * @param {number} upvotes How many upvotes the post has.
 * @param {string} communityId The ID of the posts community.
 * @param {PostAuthor} author The author data of the post.
 * @param {PostCommunity} community The community data of the post.
 * 
 * @example
 * <FullPost 
 *  id={post.id}
 *  title={post.title} 
 *  author={post.author} 
 *  community={post.community} 
 *  upvotes={post.upvotes} 
 *  downvotes={post.downvotes} 
 *  createdAt={post.createdAt} 
 *  updatedAt={post.updatedAt}
 *  public={post.public}
 *  content={post.content}
 *  imageurl={post.imageurl}
 *  imagealt={post.imagealt}
 * />
 * 
 */

export function FullPost(post: Partial<PostType> & { 
    id: string;
    title: string;
    community: { 
        name: string;
        image: string;
    },
    author: {
        username: string;
        image: string;
    }
}) {

    const { data: SESSION } = authClient.useSession();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [commentBoxOpen, setCommentBoxOpen] = useState<boolean>(false);
    
    const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);

    const t = useTranslations("Components.Post");

    return (
        <Card className="!w-full">
            <CardHeader>
                <div className="flex flex-row gap-2 items-center">
                    <Image src={post.community.image} className="w-8 h-8 rounded-sm" width={32} height={32} alt={post.community.name} />
                    <div className="flex flex-col justify-center">
                        <Label asChild className="text-xs text-muted-foreground"><Link href={`/c/${post.community.name}`}>{"c/"}{post.community.name}</Link></Label>
                        <div className="flex flex-row gap-2">
                            <Typography variant="p" className="!text-xs hover:!text-white focus:!text-white transition-all" secondary><Link href={`/user/${post.author.username}`}>{"@"}{post.author.username}</Link></Typography>
                            <Typography variant="p" className="!text-xs" secondary>{"•"}</Typography>
                            <Typography variant="p" className="!text-xs" secondary>{dayjs(post.createdAt).fromNow()}</Typography>
                        </div>
                    </div>                            
                </div>
                <Label className="text-muted-foreground mb-0.5">
                    <span className="flex items-center justify-center gap-x-1 text-[13px]">
                        <Image src={post.community.image} className="w-9 h-9 rounded-sm mr-1" width={32} height={32} alt={post.community.name} />

                        <div className="flex flex-col justify-center">
                            <a href={`/c/${post.community.name}`} className="text-primary hover:underline">
                                c/{post.community.name}
                            </a>

                            <div className="flex items-center justify-center gap-x-2 mt-1">
                                <a href={`/u/${post.author.username}`} className="text-primary hover:underline">
                                    @{post.author.username}
                                </a>

                                {"•"}

                                <span>{" " + dayjs(post.createdAt).fromNow() + " "}</span>
                            </div>
                        </div>
                    </span>
                </Label>
                <CardTitle>{post.title}</CardTitle>
            </CardHeader>
                <div className="flex w-full bg-transparent h-fit flex-col p-6">
                    <div className="text-sm relative rounded-sm">
                        {/*<BackButton className={"absolute right-0 !hidden md:!flex"} />*/}
                        <div className="flex flex-row gap-2 items-center">
                            <Image src={post.community.image} className="w-8 h-8 rounded-sm" width={32} height={32} alt={post.community.name} />
                            <div className="flex flex-col justify-center">
                                <Typography variant="p" className="!text-xs hover:!text-white focus:!text-white transition-all" secondary><Link href={`/c/${post.community.name}`}>{"c/"}{post.community.name}</Link></Typography>
                                <div className="flex flex-row gap-2">
                                    <Typography variant="p" className="!text-xs hover:!text-white focus:!text-white transition-all" secondary><Link href={`/user/${post.author.username}`}>{"@"}{post.author.username}</Link></Typography>
                                    <Typography variant="p" className="!text-xs" secondary>{"•"}</Typography>
                                    <Typography variant="p" className="!text-xs" secondary>{dayjs(post.createdAt).fromNow()}</Typography>
                                </div>
                            </div>
                        </div>
                        <Typography variant="h4">{post.title}</Typography>
                    </div>
                    
                    <div className="w-full h-fit rounded-sm mt-2">
                        {post.imageurl ?
                            <div className="relative rounded-sm mt-2 mb-4 max-h-96 overflow-hidden">
                                <div 
                                    style={{ 
                                        backgroundImage: `url(${post.imageurl})`,
                                        backgroundSize: "cover",
                                    }} 
                                    className="absolute inset-0 filter blur-xl"
                                />
                                <Image src={post.imageurl} alt={post.imagealt!} className="relative m-auto max-h-96" width={384} height={384} />
                            </div>
                        :
                            null
                        }
                        <div className="markdown-body !bg-transparent md:!bg-foreground">
                            { post.content && <Markdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>{post.content}</Markdown> }
                        </div>

                        {post.href &&
                            <OpengraphDisplay url={post.href} />
                        }

                    </div>

                    { SESSION?.user &&
                        <>
                            <Dialog.Controlled 
                                title={t("DeleteDialog.Title")} 
                                subtitle={t("DeleteDialog.Subtitle")} 
                                isOpen={deleteDialogOpen} 
                                setIsOpen={setDeleteDialogOpen}
                            >
                                <Dialog.Content>
                                    <Dialog.ButtonContainer>
                                        <Dialog.CloseButton><Button variant="Secondary">{t("DeleteDialog.Cancel")}</Button></Dialog.CloseButton>
                                        <Button variant="Destructive" disabled>{t("DeleteDialog.Delete")}</Button>
                                    </Dialog.ButtonContainer>
                                </Dialog.Content>
                            </Dialog.Controlled>

                            <div className="flex flex-row w-full h-fit rounded-sm mt-4 justify-between">
                                <div className="flex flex-row gap-2">
                                    <VoteButton 
                                        subjectID={post.id} 
                                        subject="POST"
                                    />
                                    <CreateComment
                                        open={commentBoxOpen} 
                                        setOpen={setCommentBoxOpen} 
                                        postID={post.id} 
                                        userID={SESSION.user.id}
                                    />
                                    <Button
                                        variant="Secondary"
                                        icon={<ExclamationCircleIcon />}
                                        onClick={() => setReportDialogOpen(!reportDialogOpen)}
                                        hideTextOnMobile
                                    >
                                    {t("ReportButton.Report")}
                                </Button>
                                    <div id="comment-refresh-container" />
                                </div>
                                <Menu>
                                    <Menu.Trigger><Button variant="Secondary" square icon={<EllipsisVerticalIcon />} className="!px-1" aria-label="More Options" /></Menu.Trigger>
                                    <Menu.Content>
                                        <MenuLink icon={<ProfileImage user={post.author} imgSize={"4"} measurement="units" className="rounded-sm" />} link={`/user/${post.author.username}`}>{post.author.username}</MenuLink>
                                        <MenuLink icon={<img src={post.community.image} alt={post.community.name} className="rounded-sm" />} link={`/c/${post.community.name}`}>{post.community.name}</MenuLink>
                                        <hr />
                                        <SavePostButton userID={SESSION.user?.id} postID={post.id} menuTrigger={true} />
                                        <hr />
                                        <MenuShare icon={<ShareIcon />} text={post.title} title={"Command"} url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${post.id}`} />
                                        { SESSION 
                                        ?
                                            <>
                                                { SESSION.user?.id === post.authorId 
                                                ?
                                                <>
                                                    <hr />
                                                    <MenuButton icon={<ArchiveBoxXMarkIcon />} onClick={() => setDeleteDialogOpen(true)} destructive={true}>{t("DeleteDialog.Delete")}</MenuButton>                                 
                                                </>
                                                :
                                                null
                                                }                           
                                            </>
                                        :
                                            null
                                        }
                                    </Menu.Content>
                                </Menu>
                            </div>

                            <div id="comment-submit-box"></div>

                            <CommentList postID={post.id} />          

                            <ReportDialog 
                                open={reportDialogOpen} 
                                setOpen={setReportDialogOpen} 
                                subject="POST" 
                                subjectID={post.id} 
                                reporterID={SESSION.user?.id}
                            />           
                        </>
                    }
                </div>
        </Card>
    )
}