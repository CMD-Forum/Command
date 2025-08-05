import {
    ArchiveBoxXMarkIcon,
    EllipsisHorizontalIcon,
    PencilSquareIcon,
    ShareIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

import dayjs from "@/lib/dayjs";
import { PostCommentType } from "@/types";

import Button from "@/components/button/button";
import Typography from "@/components/misc/typography";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslations } from "next-intl";
import ProfileImage from "../../account/ProfileImage";
import Dialog from "../../dialog/dialog";
import Menu from "../../menu/menu";
import VoteButton from "../buttons/vote_button";
import CreateReply from "./create_reply";
import EditComment from "./edit_comment";

export function PostComment({ comment }: { comment: PostCommentType }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [replyBoxOpen, setReplyBoxOpen] = useState<boolean>(false);
    const [editBoxOpen, setEditBoxOpen] = useState<boolean>(false);

    const handleReplyBox = () => {
        if (replyBoxOpen === true) {
            setEditBoxOpen(false);
            setReplyBoxOpen(false);
        } else {
            setEditBoxOpen(false);
            setReplyBoxOpen(true);
        }
    }
    const handleEditBox = () => {
        if (editBoxOpen === true) {
            setEditBoxOpen(false);
            setReplyBoxOpen(false);
        } else {
            setEditBoxOpen(true);
            setReplyBoxOpen(false);
        }
    }

    const { data: SESSION } = authClient.useSession();
    const t = useTranslations("Components.Comment");

    return (
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
                        <Button variant="Destructive" disabled={true}>{t("DeleteDialog.Delete")}</Button>
                    </Dialog.ButtonContainer>
                </Dialog.Content>
            </Dialog.Controlled>
            <div className="bg-transparent hover:bg-foreground active:bg-foreground h-fit rounded-sm p-4 transition-all border-l-1 border-border rounded-sm-l-none" id={`comment-${comment.id}`}>
                <div className="flex gap-1 mb-2 items-center">
                    <div className="flex gap-2 items-center">
                        <ProfileImage user={comment.user} imgSize="4" measurement="units" className="rounded-sm" />
                        <Typography variant="p" className="hover:underline !text-xs"><Link href={`/user/${comment.user.username}`} aria-label={comment.user.username}>{comment.user.username}</Link></Typography>
                    </div>
                    <Typography variant="p" className="!text-xs" secondary>•</Typography>
                    <Typography variant="p" className="!text-xs" secondary>{dayjs(comment.createdAt).fromNow()}</Typography>
                    { comment.edited &&
                        <div className="flex gap-1 items-center">
                            <Typography variant="p" className="!text-xs" secondary>•</Typography>
                            <PencilSquareIcon className="w-4 h-4 text-secondary" aria-label={t("CommentEditLabel")} />
                        </div>
                    }
                    { comment.edited && comment.updatedAt && 
                        <Typography variant="p" className="!text-xs" secondary>{dayjs(comment.updatedAt).fromNow()}</Typography>
                    }                    
                </div>
                <Typography variant="p">{comment.content}</Typography>
                <div className="flex flex-row mt-3 gap-1 items-center">
                    {SESSION?.user?.id &&
                        <>
                            <VoteButton subject="COMMENT" subjectID={comment.id} />
                            <CreateReply open={replyBoxOpen} setOpen={handleReplyBox} commentID={comment.id} userID={SESSION.user?.id} postID={comment.postId} />
                            <EditComment open={editBoxOpen} setOpen={handleEditBox} commentID={comment.id} defaultValue={comment.content} />
                        </>
                    }

                    <Menu defaultPlacement="bottom">
                        <Menu.Trigger><Button variant="Ghost" className="!text-secondary hover:!text-white transition-all" square icon={<EllipsisHorizontalIcon />} /></Menu.Trigger>
                        <Menu.Content>
                            <Menu.Link icon={<ProfileImage user={comment.user} imgSize={"4"} className="rounded-sm" />} link={`/user/${comment.user.username}`}>{comment.user.username}</Menu.Link>
                            <hr />
                            <Menu.Share icon={<ShareIcon />} text={comment.content} title={"Command"} url={`${process.env.NEXT_PUBLIC_CURRENT_URL}posts/${comment.postId}#comment-${comment.id}`} />
                            { SESSION?.user?.id === comment.userId 
                            ?
                                <Menu.Button icon={<ArchiveBoxXMarkIcon />} onClick={() => setDeleteDialogOpen(true)} destructive={true}>{t("DeleteDialog.Delete")}</Menu.Button>
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