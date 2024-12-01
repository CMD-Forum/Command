import { 
    ArchiveBoxXMarkIcon,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    ShareIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

import dayjs from "@/app/(general)/lib/dayjs";
import { useSession } from "@/app/(general)/lib/sessioncontext";
import { PostCommentType } from "@/types/types";

import ProfileImage from "../../account/ProfileImage";
import Dialog from "../../dialog/dialog";
import Menu from "../../menu/menu";
import CreateReply from "./create_reply";
import EditComment from "./edit_comment";

export function PostComment({ comment }: { comment: PostCommentType }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const session = useSession();

    return (
        <>
            <Dialog.Controlled isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen}>
                <Dialog.Content>
                    <Dialog.Title>Delete this comment? (Unimplemented)</Dialog.Title>
                    <Dialog.Subtitle>This action cannot be reversed, choose wisely.</Dialog.Subtitle>
                    <Dialog.ButtonContainer>
                        <Dialog.CloseButton><button className='navlink'>Close</button></Dialog.CloseButton>
                        <button className='navlink-destructive' disabled>Delete</button>
                    </Dialog.ButtonContainer>
                </Dialog.Content>
            </Dialog.Controlled>
            <div className="bg-transparent hover:bg-card active:bg-card h-fit rounded-lg p-4 transition-all border-l-1 border-border rounded-l-none" id={comment.id}>
                <div className="flex gap-1 mb-1 items-center">
                    <div className="flex gap-1 items-center">
                        {/* @ts-ignore */}
                        <ProfileImage user={comment.user} imgSize="4" alt={`Profile Image of ${comment.user.username}`} />
                        <Link href={`/user/${comment.user.username}`} className="subtitle hover:underline !text-xs" aria-label={comment.user.username}>{comment.user.username}</Link>                    
                    </div>
                    <p className='subtitle !text-xs'>•</p> 
                    <p className="!text-xs">{dayjs(comment.createdAt).fromNow()}</p>
                    { comment.edited &&
                        <div className="flex gap-1 items-center">
                            <p className='!text-xs'>•</p> 
                            <PencilSquareIcon className="w-4 h-4 text-gray-300" aria-label="This comment has been edited." />
                        </div>
                    }
                    { comment.edited && comment.updatedAt && 
                        <p className="!text-xs">{dayjs(comment.updatedAt).fromNow()}</p>
                    }                    
                </div>
                <p>{comment.content}</p>
                <div className="flex flex-row mt-3 gap-1">

                    {session.user?.id &&
                        <CreateReply commentID={comment.id} userID={session.user?.id} postID={comment.postId} />
                    }

                    { session.user?.id === comment.userId &&
                        <EditComment commentID={comment.id} />
                    }

                    <Menu defaultPlacement="bottom">
                        <Menu.Trigger><button className="navlink small !text-gray-300 hover:!text-white transition-all !px-1"><EllipsisVerticalIcon className="w-4 h-4" /></button></Menu.Trigger>
                        <Menu.Content>
                        {/* @ts-ignore */}
                        <Menu.Link text={comment.user.username} icon={<ProfileImage user={comment.user} imgSize={"5"} />} link={`/user/${comment.user.username}`}></Menu.Link>
                            <hr className='mt-1 !mb-1'/>
                            <Menu.Share icon={<ShareIcon />} text={comment.content} title={"Command"} url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${comment.postId}#${comment.id}`} />
                            { session.user?.id === comment.userId 
                            ?
                                <Menu.Button icon={<ArchiveBoxXMarkIcon />} text={"Delete"} onClick={() => setDeleteDialogOpen(true)} destructive={true} />
                            :
                                null
                            }
                        </Menu.Content>
                    </Menu>
                </div>
                <div id={`reply-submit-box-${comment.id}`} />
            </div>        
        </>
    )
}