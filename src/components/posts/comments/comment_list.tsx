"use client";

import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { legacy_logError, log } from "@/lib/utils";
import { PostCommentType } from "@/types";

import { CommentAPIResponse } from "@/app/api/comments/getAll/[postID]/route";
import Button from "@/components/button/button";
import Image from "@/components/misc/image";
import { ListError } from "@/components/misc/listError";
import Typography from "@/components/misc/typography";
import { PostComment } from "@/components/posts/comments/comment";
import useFetch from "@/lib/hooks/data/useFetch";
import { useTranslations } from "next-intl";

export function CommentLoader() {
    const t = useTranslations("Components.CommentList");
    return (
        <div className="flex flex-col w-full items-center justify-center h-[200px] gap-2 relative group transition-all bg-transparent md:bg-foreground rounded-sm p-4">
            <Image src="/LoadingSpinner.svg" alt="Loading Comment..." width={512} height={512} className="h-8 w-8 animate-spin" />
            <Typography variant="p" className="!text-secondary">{t("LoadingComments")}</Typography>
        </div>
    );
}

export default function CommentList({ postID }: { postID: string }) {

    const t = useTranslations("Components.CommentList");

    const [refresh, setRefresh] = useState<number>(0);
    const { data: COMMENTS, loading, responseMessage: RESPONSE_MESSAGE, errorCode: ERROR_CODE, statusCode: STATUS_CODE } = useFetch<CommentAPIResponse>({ 
        url: `/api/comments/getAll/${postID}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    
    if (ERROR_CODE) {
        log({ type: "error", message: "API returned following error code: " + ERROR_CODE + " and message: " + RESPONSE_MESSAGE, scope: "comment_list.tsx" });
        return <ListError />
    }

    if (loading) {
        return (
            <div className="flex flex-col mt-4 gap-2">
                {createPortal(
                    <Button variant="Secondary" square={true} className="small !bg-border animate-pulse !text-border" aria-label="Loading Comments" icon={<ArrowPathIcon />} />,
                    document.getElementById("comment-refresh-container") || document.body
                )}
                <CommentLoader />
            </div>
        );
    }

    if (!COMMENTS || COMMENTS === null || COMMENTS.length === 0 || STATUS_CODE === 204) return <ListError title={t("NoComments.Title")} subtitle={t("NoComments.Subtitle")} />

    return (
        <div className="flex flex-col mt-4">
            {createPortal(
                <Button variant="Secondary" square={true} onClick={() => setRefresh(refresh + 1)} className="!px-1" aria-label="Refresh Comments" icon={<ArrowPathIcon />} />,
                document.getElementById("comment-refresh-container") || document.body
            )}
            {Array.isArray(COMMENTS) && COMMENTS.map((COMMENT) => {
                return (
                    <div 
                        key={COMMENT.id}
                    >
                        <PostComment  
                            comment={COMMENT}
                        />
                        <ReplyList commentID={COMMENT.id} />
                    </div>
                  );
            })}
        </div>
    );
}

export function ReplyList({ commentID }: { commentID: string }) {

    const t = useTranslations("Components.ReplyList");

    const [replies, setReplies] = useState<PostCommentType>();
    const [isReplies, setIsReplies] = useState<boolean>();
    const [showReplies, setShowReplies] = useState<boolean>(false);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // setIsLoading(true);
        fetch(`/api/comments/hasReplies/${commentID}`, {
            method: "GET",
            headers: {
                "Content-Type": "applicaton/json",
            },
        })
        .then((res) => {
            if (res.status === 200) {
                setIsReplies(true);
                // setIsLoading(false);
            } else {
                setIsReplies(false);
                // setIsLoading(false);
            }
        })
    }, [commentID]);

    const fetchReplies = () => {
        // setIsLoading(true),
        fetch(`/api/comments/getReplies/${commentID}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json"
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setReplies(data);
            setShowReplies(true);
            // setIsLoading(false);
        })
        .catch((error) => {
            legacy_logError(error);
            // setIsLoading(false);
            return (
                <Typography variant="p">{t("ReplyFetchFailed")}</Typography>
            );
        })
    };

    return (
        <div className="flex flex-col pl-2 border-l border-border">
            {(showReplies === false && isReplies) &&
                <Button variant="Ghost" className="small !text-secondary hover:!text-white transition-all my-1" onClick={() => fetchReplies()} icon={<ArrowDownTrayIcon />}>{t("LoadReplies")}</Button>
            }

            {showReplies && isReplies && Array.isArray(replies) && replies.map((reply) => {
                return (
                    <div 
                      key={reply.id}
                    >
                      <PostComment  
                        comment={reply}
                      />
                      <ReplyList commentID={reply.id} />
                    </div>
                );
            })}
        </div>
    );
}
