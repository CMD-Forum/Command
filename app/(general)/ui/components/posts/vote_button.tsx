"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

import Dialog from "../dialog/dialog";

export default function VoteButton({ postID, userID, sessionID }: { postID: string, userID: string, sessionID: string }) {
    const [upvoted, setUpvoted] = useState<boolean>();
    const [downvoted, setDownvoted] = useState<boolean>();
    const [totalUpvotes, setTotalUpvotes] = useState<number>(0);
    const [totalDownvotes, setTotalDownvotes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/posts/vote/getTotalVotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionID}`
            },
            body: JSON.stringify({ "postID": `${postID}` })
        })
        .then((res) => {
            res.json().then((body) => {
                if (res.status === 200) {
                    setTotalUpvotes(body.upvotes);
                    setTotalDownvotes(body.downvotes);
                    setIsLoading(false);
                } else {
                    setTotalUpvotes(0);
                    setTotalDownvotes(0);
                }
            })
        })
    }, [postID, sessionID]);

    useEffect(() => {
        setIsLoading(true); 
        fetch("/api/posts/vote/getVote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionID}`
            },
            body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
        })
        .then((res) => {
            res.json().then((body) => {
                if ( res.status === 200 ) {
                    setUpvoted(body.upvote);
                    setDownvoted(body.downvote)
                } else {
                    setUpvoted(undefined);
                    setDownvoted(undefined);
                    return (
                        <div className='flex'>
                            <button className={`navlink !px-2 mr-auto !br-0 !rounded-r-none !bg-border !animate-pulse`} aria-label='Loading'><ChevronUpIcon className='w-5 h-5 !text-border' /></button>
                            <div className="navlink !rounded-none !text-border !animate-pulse">99</div>
                            <button className={`navlink !px-2 mr-auto !bl-0 !rounded-l-none !bg-border !animate-pulse`} aria-label='Loading'><ChevronDownIcon className='w-5 h-5 !text-border' /></button>
                        </div>
                    );
                }
            });
        })
        setIsLoading(false);
    }, [postID, userID, totalUpvotes, totalDownvotes, sessionID]);

    function upvote() {
        setDownvoted(false);
        if ( upvoted === false ) {
            fetch("/api/posts/vote/upvote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionID}`
                },
                body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
            })
            .then((res) => {
                if (res.status === 200) {
                    setUpvoted(true);
                    setTotalUpvotes(totalUpvotes + 1);
                    return res.json();                    
                }
                return { error: "Failed to upvote post." }
            })
        } else if ( upvoted === true ) {
            fetch("/api/posts/vote/upvote/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionID}`
                },
                body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
            })
            .then((res) => {
                if ( res.status === 200 ) {
                    setUpvoted(false);
                    setTotalUpvotes(totalUpvotes - 1);
                    return res.json();
                }         
                return { error: "Failed to remove upvote." }
            })  
        }
    }

    function downvote() {
        setUpvoted(false);
        if ( downvoted === false ) {
            fetch("/api/posts/vote/downvote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionID}`
                },
                body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
            })
            .then((res) => {
                if (res.status === 200) {
                    setDownvoted(true);
                    setTotalDownvotes(totalDownvotes + 1);
                    return res.json();                    
                }
                return { error: "Failed to downvote post." }
            })
        } else if ( downvoted === true ) {
            fetch("/api/posts/vote/downvote/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionID}`
                },
                body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
            })
            .then((res) => {
                if ( res.status === 200 ) {
                    setDownvoted(false);
                    setTotalDownvotes(totalDownvotes - 1);
                    return res.json();
                }         
                return { error: "Failed to remove downvote." }
            })  
        }
    }

    if ( isLoading ) {
        return (
            <div className='flex'>
                <button className={`navlink !px-2 mr-auto !br-0 !rounded-r-none !bg-border !animate-pulse !text-border`} aria-label='Loading'><ChevronUpIcon className='w-5 h-5 !text-border' />99</button>
                <button className={`navlink !px-2 mr-auto !bl-0 !rounded-l-none !bg-border !animate-pulse !text-border`} aria-label='Loading'><ChevronDownIcon className='w-5 h-5 !text-border' />99</button>
            </div>
        );
    }

    // console.log("upvoted", upvoted);
    // console.log("downvoted", downvoted);

    return (
        <div className='flex'>
            <button className={`navlink !px-2 mr-auto !br-0 !rounded-r-none transition-all ${upvoted && "!bg-border !text-green-300"}`} aria-label='Upvote' onClick={() => upvote()}><ChevronUpIcon className="w-5 h-5" />{ totalUpvotes }</button>
            <button className={`navlink !px-2 mr-auto !bl-0 !rounded-l-none transition-all ${downvoted && "!bg-border !text-red-300"}`} aria-label='Downvote' onClick={() => downvote()}><ChevronDownIcon className="w-5 h-5" /> { totalDownvotes }</button>                                    
        </div>
    );

}

export function SignedOutVoteButton({ postID }: { postID: string }) {
    const [totalUpvotes, setTotalUpvotes] = useState<number>(0);
    const [totalDownvotes, setTotalDownvotes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/posts/vote/getTotalVotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "postID": `${postID}` })
        })
        .then((res) => {
            res.json().then((body) => {
                if (res.status === 200) {
                    setTotalUpvotes(body.upvotes);
                    setTotalDownvotes(body.downvotes);
                    setIsLoading(false);
                } else {
                    setTotalUpvotes(0);
                    setTotalDownvotes(0);
                }
            })
        })
    }, [postID]);

    if ( isLoading ) {
        return (
            <div className='flex'>
                <button className={`navlink !px-2 mr-auto !br-0 !rounded-r-none !bg-border !animate-pulse !text-border`} aria-label='Loading'><ChevronUpIcon className='w-5 h-5 !text-border' />99</button>
                <button className={`navlink !px-2 mr-auto !bl-0 !rounded-l-none !bg-border !animate-pulse !text-border`} aria-label='Loading'><ChevronDownIcon className='w-5 h-5 !text-border' />99</button>
            </div>
        );
    }

    return (
        <Dialog>
            <Dialog.Trigger>
                <div className='flex'>
                    <button className={`navlink !px-2 mr-auto !br-0 !rounded-r-none transition-all`} aria-label='Upvote'><ChevronUpIcon className="w-5 h-5" />{ totalUpvotes }</button>
                    <button className={`navlink !px-2 mr-auto !bl-0 !rounded-l-none transition-all`} aria-label='Downvote'><ChevronDownIcon className="w-5 h-5" /> { totalDownvotes }</button>
                </div>                
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Login to vote.</Dialog.Title>
                <Dialog.Subtitle>To vote on a post, you need to be logged in.</Dialog.Subtitle>
                <Dialog.ButtonContainer>
                    <Dialog.CloseButton><button className="navlink">Cancel</button></Dialog.CloseButton>
                    <Link href={"/login"} className="navlink-full">Login</Link>
                </Dialog.ButtonContainer>
            </Dialog.Content>
        </Dialog>
    );
}