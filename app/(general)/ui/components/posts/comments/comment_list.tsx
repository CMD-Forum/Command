"use client";

import { 
    ArrowDownTrayIcon,
    ArrowPathIcon,
} from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { logError } from '@/app/(general)/lib/utils';
import { PostCommentType } from '@/types/types';

import { PostComment } from './comment';

export default function CommentList({ postID }: { postID: string }) {

    const [comments, setComments] = useState<PostCommentType>();
    const [refresh, setRefresh] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    try {        
        useEffect(() => {
            setIsLoading(true),
            fetch("/api/comments/getAll/", {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "postID": `${postID}` })
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setComments(data);
                setIsLoading(false);
            });
        }, [postID, refresh]);
    } catch ( error ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-card h-[174px] rounded-lg px-5 py-5 mt-4'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Sorry, an error occurred.</p>
                {/*<div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink' onClick={() => router.refresh()} type='button'>Reload</button>
                </div>*/}
            </div>            
        );
    }  

    if ( isLoading ) {
        return (
            <div className='flex flex-col mt-4 gap-2'>
                {createPortal(
                    <button className='navlink !px-2 !bg-border animate-pulse !text-border' aria-label='Loading Comments'><ArrowPathIcon className='w-5 h-5' /></button>,
                    document.getElementById("comment-refresh-container") || document.body
                )}
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
                <div className='h-20 w-full bg-border animate-pulse rounded' />
            </div>
        );
    }

    // @ts-ignore
    if ( ! comments ) {
        return (
            <div className='flex flex-col items-center justify-center w-full relative group transition-all bg-transparent h-[174px] rounded-lg px-5 py-5 mt-4'>
                <p className='text-center text-gray-300 font-medium antialiased w-full'>Looks like there&apos;s no comments here.</p>
                <div className='flex gap-4 w-full items-center justify-center mt-4'>
                    <button className='navlink'>Comment on this post</button>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col mt-4'>
            {createPortal(
                <button onClick={() => setRefresh(refresh + 1)} className='navlink !px-2' aria-label='Refresh Comments'><ArrowPathIcon className='w-5 h-5' /></button>,
                document.getElementById("comment-refresh-container") || document.body
            )}
            {Array.isArray(comments) && comments.map((comment) => {
                return (
                    <div 
                      key={comment.id}
                    >
                      <PostComment  
                        comment={comment}
                      />
                      <ReplyList commentID={comment.id} />
                    </div>
                  );
            })}
        </div>
    );
}

export function ReplyList({ commentID }: { commentID: string }) {

    const [replies, setReplies] = useState<PostCommentType>();
    const [isReplies, setIsReplies] = useState<boolean>();
    const [showReplies, setShowReplies] = useState<boolean>(false);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // setIsLoading(true);
        fetch("/api/comments/hasReplies", {
            method: 'POST',
            headers: {
                "Content-Type": "applicaton/json",
            },
            body: JSON.stringify({ "commentID": `${commentID}` })
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
        fetch("/api/comments/getReplies/", {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "commentID": `${commentID}` })
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
            logError(error);
            // setIsLoading(false);
            return (
                <p>Failed to fetch replies.</p>
            );
        })
    };

    return (
        <div className='flex flex-col pl-2'>

            {showReplies === false && isReplies &&
                <button className='navlink small !text-gray-300 hover:!text-white transition-all my-2' onClick={() => fetchReplies()}><ArrowDownTrayIcon className='w-4 h-4' />Load Replies</button>
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
