"use client";

import { ArchiveBoxXMarkIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/16/solid';
import { EllipsisVerticalIcon, ShareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm'

import dayjs from '@/app/(general)/lib/dayjs'
import { useSession } from "@/app/(general)/lib/sessioncontext";
import { Post } from '@/types/types';

import ProfileImage from '../account/ProfileImage';
import Dialog from '../dialog/dialog';
import Menu, { MenuButton, MenuLink, MenuShare } from '../menu/menu';
import { SavePostButton } from '../posts/save_post_button';
import { BackButtonNormal } from './back_button';
import CommentList from './comments/comment_list';
import CreateComment from './comments/create_comment';
import { DeleteAsAdminButton, DeleteAsAuthorButton } from './delete_button';
import OpengraphDisplay from './og_display';
import VoteButton, { SignedOutVoteButton } from './vote_button';

/**
 * Horizontal card display of the given post.
 * 
 * @param {string} id ID of the post.
 * @param {Date} createdAt When the post was created.
 * @param {Date} updatedAt When the post was updated in the database.
 * @param {string} title Title of the post.
 * @param {string} content Main content of the post.
 * @param {string} tagline Tagline of the post.
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
 */

export function CardPost( post: Post ) {
    const session = useSession();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [adminDeleteDialogOpen, setAdminDeleteDialogOpen] = useState<boolean>(false);

    const isAdmin = post.community.admins.some(admin => admin.userId === session.user?.id);

    return (
        <div className="flex flex-col sm:flex-row w-full items-center gap-4 relative group transition-all bg-card border-0 border-border group-hover/title:!border-white h-fit rounded-lg p-6">
            <div className="flex w-full bg-transparent h-fit flex-col">
                <div className="text-sm z-20 w-fit flex flex-col">
                    <div className='flex flex-col'>
                        <div className='flex flex-row gap-2 items-center justify-center'>
                            <div className='flex flex-col'>
                                <Link href={`/c/${post.community.name}`} className='subtitle hover:underline w-fit !text-xs !text-white'>c/{post.community.name}</Link>
                                { ! post.author ?
                                    <div>
                                        <h2 className='hover:underline flex gap-1 subtitle !text-xs'>[deleted]</h2> 
                                        <p className='subtitle !text-xs'>•</p> 
                                        <p className='subtitle !text-xs' suppressHydrationWarning>{dayjs(post.createdAt).fromNow()}</p>
                                    </div>
                                    :
                                    <div className='hidden md:flex flex-row gap-1'>  
                                        <Link href={`/user/${post.author.username}`} className='subtitle hover:underline !text-xs'>@{post.author.username}</Link>
                                        <p className='hidden sm:flex subtitle !text-xs'>•</p> 
                                        <p className='hidden sm:flex subtitle !text-xs' suppressHydrationWarning>{dayjs(post.createdAt).fromNow()}</p>
                                    </div>
                                }                                                                                                
                            </div>
                        </div>
                    </div>
                </div>
                
                <Link href={`/posts/${post.id}`} className="w-fit font-sans font-semibold text-[18px] md:text-lg transition-all">{post.title}</Link>

                {post.imageurl 
                    ?
                    <img rel='preload' src={post.imageurl} alt={post.imagealt!} className={`rounded-lg max-h-[500px] w-full mt-2 m-auto overflow-hidden bg-cover`} />
                    :
                    <>
                        {/*<img rel='preload' src={"/text_post_icon.webp"} alt={"This post has no image."} className={`rounded-lg hidden sm:flex ${session ? "sm:!max-w-[146px] sm:!min-w-[146px] sm:!h-[146px] sm:!w-[146px]" : "sm:!max-w-[104px] sm:!min-w-[104px] sm:!h-[104px] sm:!w-[104px]" } m-auto overflow-hidden bg-cover`} />*/}            
                    </>
                }

                {post.href &&
                    <div className='mt-2'>
                        <OpengraphDisplay url={post.href} />
                    </div>
                }

                {/*<p className='subtitle'>{post.tagline}</p>*/}

                { true &&
                    <>
                        <Dialog.Controlled isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen}>
                            <Dialog.Content>
                                <Dialog.Title>Delete this post?</Dialog.Title>
                                <Dialog.Subtitle>This action cannot be reversed, choose wisely.</Dialog.Subtitle>
                                <Dialog.ButtonContainer>
                                    <Dialog.CloseButton><button className='navlink'>Close</button></Dialog.CloseButton>
                                    { session.user?.id === post.authorId &&
                                        <DeleteAsAuthorButton postID={post.id} btnClassName={"navlink-destructive"} />
                                    }
                                </Dialog.ButtonContainer>
                            </Dialog.Content>
                        </Dialog.Controlled>

                        <Dialog.Controlled isOpen={adminDeleteDialogOpen} setIsOpen={setAdminDeleteDialogOpen}>
                            <Dialog.Content>
                                <Dialog.Title>Delete this post?</Dialog.Title>
                                <Dialog.Subtitle>This will be recorded in the moderation logs.</Dialog.Subtitle>
                                <Dialog.ButtonContainer>
                                    <Dialog.CloseButton><button className='navlink'>Close</button></Dialog.CloseButton>
                                    { isAdmin &&
                                        <DeleteAsAdminButton postID={post.id}  btnClassName={"navlink-destructive"} />
                                    }
                                </Dialog.ButtonContainer>
                            </Dialog.Content>
                        </Dialog.Controlled>
                        <div className='flex flex-row mt-4 justify-between'>
                            <div className='flex flex-row gap-2'>
                                { session.user?.id 
                                ? 
                                    <VoteButton postID={post.id} userID={session.user?.id} sessionID={session.session.id} />
                                :
                                    <SignedOutVoteButton postID={post.id} />
                                }
                                <Link className='navlink !px-2 md:!px-3 mr-auto' href={`/posts/${post.id}`}><ChatBubbleLeftEllipsisIcon className='w-5 h-5' /><span className='hidden md:flex'>Comments</span></Link>                       
                                { session.user?.id && 
                                    <SavePostButton userID={session.user.id} postID={post.id} />
                                }
                            </div>

                            <Menu>
                                <Menu.Trigger><button className='navlink !px-2' aria-label='More Options'><EllipsisVerticalIcon className='w-5 h-5' /></button></Menu.Trigger>
                                <Menu.Content>
                                    <MenuLink text={post.author.username} icon={<ProfileImage user={post.author} imgSize={"5"} />} link={`/user/${post.author.username}`}></MenuLink>
                                    <MenuLink text={post.community.name} icon={<img src={post.community.image} alt={post.community.name} />} link={`/c/${post.community.name}`}></MenuLink>
                                    <hr className='mt-1 !mb-1'/>
                                    <MenuShare icon={<ShareIcon />} text={post.title} title={"Command"} url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${post.id}`} />
                                    {session.user?.id === post.author.id || isAdmin && session.user?.id !== post.author.id ? <hr className='mt-1 !mb-1'/> : null}
                                    { session.user?.id === post.authorId
                                    &&
                                        <>
                                            <MenuButton icon={<ArchiveBoxXMarkIcon />} text={"Delete"} onClick={() => setDeleteDialogOpen(true)} destructive={true} />
                                        </>
                                    }
                                    { isAdmin && session.user?.id !== post.author.id
                                    &&
                                        <>
                                            <MenuButton icon={<ArchiveBoxXMarkIcon />} text={"Delete as Admin"} onClick={() => setAdminDeleteDialogOpen(true)} destructive={true} />
                                        </>
                                    }
                                </Menu.Content>
                            </Menu>
                        </div>                    
                    </>
                }
            </div>
        </div>
    )
}

/**
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

export function FullPost( post: Post ) {

    const session = useSession();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    return (
        <div className="rounded-lg flex w-full bg-transparent h-fit mt-4">
                <div className="flex w-full bg-transparent h-fit flex-col">
                    <div className="text-sm relative rounded-lg">
                        <BackButtonNormal className={"absolute right-0 !hidden md:!flex"} />
                        <div className='flex flex-row gap-2 items-center'>
                            <img src={post.community.image} className='w-8 h-8 rounded-lg' alt={post.community.name}></img>
                            <div className='flex flex-col justify-center'>
                                <p>c/{post.community.name}</p>
                                <div className="flex flex-row">
                                    <h4 className="w-fit flex gap-2">
                                        <p className='subtitle'>@{post.author.username}</p>
                                        <p className='subtitle'>•</p> 
                                        <p className='subtitle'>{dayjs(post.createdAt).fromNow()}</p> 
                                    </h4>   
                                </div>                                   
                            </div>                            
                        </div>
                        <h1 className="header-4">{post.title}</h1>
                    </div>
                    
                    <div className='w-full h-fit rounded-lg mt-2'>
                        {post.imageurl ?
                            <div className="relative rounded-lg mt-2 mb-4 max-h-96 overflow-hidden">
                                <div 
                                    style={{ 
                                        backgroundImage: `url(${post.imageurl})`,
                                        backgroundSize: 'cover',
                                    }} 
                                    className="absolute inset-0 filter blur-xl"
                                />
                                <img src={post.imageurl} alt={post.imagealt!} className="relative m-auto max-h-96" />
                            </div>
                        :
                            null
                        }
                        <div className='markdown-body'>
                            { post.content &&
                                <Markdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
                            }
                        </div>

                        {post.href &&
                            <OpengraphDisplay url={post.href} />
                        }

                    </div>

                    { session?.user &&
                        <>
                            <Dialog.Controlled isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen}>
                                <Dialog.Content>
                                    <Dialog.Title>Delete this post? (Unimplemented)</Dialog.Title>
                                    <Dialog.Subtitle>This action cannot be reversed, choose wisely.</Dialog.Subtitle>
                                    <Dialog.ButtonContainer>
                                        <Dialog.CloseButton><button className='navlink'>Close</button></Dialog.CloseButton>
                                        <button className='navlink-destructive' disabled>Delete</button>
                                    </Dialog.ButtonContainer>
                                </Dialog.Content>
                            </Dialog.Controlled>
                            <div className='flex flex-row w-full h-fit rounded-lg mt-4 justify-between'>
                                <div className='flex flex-row gap-2'>
                                    <VoteButton postID={post.id} userID={session.user.id} sessionID={session.session.id} />
                                    <CreateComment postID={post.id} userID={session.user.id} />
                                    <SavePostButton userID={session.user?.id} postID={post.id} />
                                    <div id='comment-refresh-container' />
                                </div>
                                <Menu>
                                    <Menu.Trigger><button className='navlink !px-2' aria-label='More Options'><EllipsisVerticalIcon className='w-5 h-5' /></button></Menu.Trigger>
                                    <Menu.Content>
                                        <MenuLink text={post.author.username} icon={<ProfileImage user={post.author} imgSize={"5"} />} link={`/user/${post.author.username}`}></MenuLink>
                                        <MenuLink text={post.community.name} icon={<img src={post.community.image} alt={post.community.name} />} link={`/c/${post.community.name}`}></MenuLink>
                                        <hr className='mt-1 !mb-1'/>
                                        <MenuShare icon={<ShareIcon />} text={post.title} title={"Command"} url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${post.id}`} />
                                        { session 
                                        ?
                                            <>
                                                { session.user?.id === post.authorId 
                                                ?
                                                <>
                                                    <hr className='mt-1 !mb-1'/>
                                                    <MenuButton icon={<ArchiveBoxXMarkIcon />} text={"Delete"} onClick={() => setDeleteDialogOpen(true)} destructive={true} />                                 
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

                            <div id='comment-submit-box'></div>

                            <CommentList postID={post.id} />                     
                        </>
                    }
                </div>
        </div>
    )
}