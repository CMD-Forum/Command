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
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { assets_paths } from "@/lib/asset-paths";
import { authClient } from "@/lib/auth/auth-client";
import useFetch from "@/lib/hooks/data/useFetch";
import { Post as PostType } from "@prisma/client";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import ProfileImage from "../account/ProfileImage";
import Button from "../button/button";
import Checkbox from "../checkbox/checkbox";
import Dialog from "../dialog/dialog";
import Menu, {
    MenuButton,
    MenuLink,
    MenuShare
} from "../menu/menu";
import Typography from "../misc/typography";
import { SavePostButton } from "../posts/buttons/save_post_button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "../ui/card";
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
        image: string | null;
        createdAt: Date;
        description: string | null;
    },
    author: {
        id: string,
        username: string;
        image: string | null;
        createdAt: Date;
    },
    view?: "Card" | "Compact"
}) {

    const { data: SESSION } = authClient.useSession();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const { data: isModerator } = useFetch<string | boolean>({ url: "/api/community/moderation/isModerator", bodyParams: {"userID": `${SESSION?.user.id}`, "communityID": `${post.community.id}`}});

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
                        <PostActions
                            postInformation={{ 
                                id: post.id, 
                                title: post.title, 
                                author: {
                                    id: post.author.id,
                                    username: post.author.username, 
                                    image: post.author.image,
                                    createdAt: post.author.createdAt,
                                    isModerator: isModerator as boolean || false
                                },
                                community: {
                                    name: post.community.name,
                                    image: post.community.image,
                                    createdAt: post.community.createdAt,
                                    description: post.community.description
                                }   
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex w-full lg:!hidden">
                <PostActions
                    postInformation={{ 
                        id: post.id, 
                        title: post.title, 
                        author: {
                            id: post.author.id,
                            username: post.author.username, 
                            image: post.author.image,
                            createdAt: post.author.createdAt,
                            isModerator: isModerator as boolean || false
                        },
                        community: {
                            name: post.community.name,
                            image: post.community.image,
                            createdAt: post.community.createdAt,
                            description: post.community.description
                        }
                    }}                
                />
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
        image: string | null,
        description: string | null,
        createdAt: Date,
    },
    author: {
        id: string,
        username: string;
        createdAt: Date;
        image: string | null;
        description: string | null;
    }
    view?: "FullCard" | "ThumbnailCard"
}) {

    const { data: SESSION } = authClient.useSession();
    const { data: isModerator } = useFetch<JSON | boolean>({ url: "/api/community/moderation/isModerator", bodyParams: {"userID": `${SESSION?.user.id}`, "communityID": `${post.community.id}`}});
    
    const t = useTranslations("Components.Post");
    const isMobile = useIsMobile();

    const [imageFailed, setImageFailed] = useState<boolean>(false);

    return (
        <Card className="!flex-row !gap-0 !py-4 !pr-4 !pl-4">
            { post.view === "ThumbnailCard" && !isMobile && !imageFailed &&
                <CardContent className="!p-0 !pr-4">
                    <img
                        src={post.imageurl || assets_paths.images.posts.NoImage} 
                        alt={t("Image.Alt", { post_title: post.title, post_author: post.author.username })}
                        className="!rounded-sm !object-cover max-w-[100px] max-h-[100px]"
                        width={105}
                        height={105}
                    />
                </CardContent>
            }
            { imageFailed &&
                <CardContent className="!p-0 !pr-4">
                    <img
                        src={assets_paths.images.posts.ImageFailed}
                        alt={t("Image.LoadingFailed")}
                        className="!rounded-sm !object-cover max-w-[100px] max-h-[100px]"
                        width={105}
                        height={105}
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
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <a href={`/u/${post.author.username}`} className="text-primary hover:underline">
                                        u/{post.author.username}
                                    </a>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="flex gap-4">
                                        <Avatar>
                                            <AvatarImage src={post.author.image || undefined} />
                                            <AvatarFallback>{post.author.username.slice(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold">u/{post.author.username}</h4>
                                            { 
                                                post.author.description !== "This user has not set their description."
                                                && 
                                                <p className="text-sm">
                                                    {post.author.description}
                                                </p>
                                            }
                                            <div className="text-muted-foreground text-xs">
                                                {t("Joined")} {dayjs(post.author.createdAt).format("MMMM D, YYYY").toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                            {t("To")}
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <a href={`/c/${post.community.name}`} className="text-primary hover:underline">
                                        c/{post.community.name}
                                    </a>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="flex gap-4">
                                        <Avatar>
                                            <AvatarImage src={post.community.image || undefined} />
                                            <AvatarFallback>{post.community.name.slice(0,1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold">c/{post.community.name}</h4>
                                            { 
                                                post.community.description !== "This community doesn't have a description."
                                                && 
                                                <p className="text-sm">
                                                    {post.community.description}
                                                </p>
                                            }
                                            <div className="text-muted-foreground text-xs">
                                                {t("Created")} {dayjs(post.author.createdAt).format("MMMM D, YYYY").toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </span>
                    </Label>
                }
                <CardTitle className={clsx("leading-tight mt-1", post.imageurl ? "mb-2" : "mb-0")}><a href={`/posts/${post.id}`}>{post.title}</a></CardTitle>
                { post.view === "FullCard" && post.imageurl && !imageFailed &&
                    <div className="flex justify-center items-center w-full h-full rounded-md" style={{ backgroundImage: `url(${post.imageurl})` }}>
                        <img
                            src={post.imageurl}
                            onError={() => setImageFailed(true)}
                            alt={t("Image.Alt", { post_title: post.title, post_author: post.author.username })}
                            className={`!rounded-md !w-full !max-h-100 object-contain backdrop-blur-lg backdrop-brightness-50`}
                        />
                    </div>
                }
                <CardFooter className="!h-fit !px-0 !w-full">
                    <PostActions 
                        postInformation={{ 
                            id: post.id, 
                            title: post.title, 
                            author: {
                                id: post.author.id,
                                username: post.author.username, 
                                image: post.author.image,
                                createdAt: post.author.createdAt,
                                isModerator: isModerator as boolean || false
                            },
                            community: {
                                name: post.community.name,
                                image: post.community.image,
                                createdAt: post.community.createdAt,
                                description: post.community.description
                            }
                        }}
                    />
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