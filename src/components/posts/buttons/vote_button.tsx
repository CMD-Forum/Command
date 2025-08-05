"use client";

import { useCallback, useEffect, useState } from "react";

import { createToast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import useFetch from "@/lib/hooks/data/useFetch";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * ## VoteButton
 * ---
 * @param subjectID The ID of the subject (what is being voted on).
 * @param subject What the subject is (post or comment)
 * @returns 
 */

export default function VoteButton({
    subjectID, 
    subject = "POST", 
}: { 
    subjectID: string;
    subject: "POST" | "COMMENT";
}) {

    const t = useTranslations("Components.Post.Vote");

    const { data: SESSION } = authClient.useSession();

    const USER_ID = SESSION?.user?.id;
    const SESSION_ID = SESSION?.session?.id

    const [upvoted, setUpvoted] = useState<boolean>();
    const [downvoted, setDownvoted] = useState<boolean>();
    const [totalUpvotes, setTotalUpvotes] = useState<number>(0);
    const [totalDownvotes, setTotalDownvotes] = useState<number>(0);

    const { data: TOTAL_VOTES, loading: totalVotesLoading } = useFetch<{ upvotes: number, downvotes: number }>({ 
        url: `/api/${subject === "POST" ? "posts" : "comments"}/vote/getTotalVotes`, 
        bodyParams: { 
            [`${subject.toLowerCase()}ID`]: `${subjectID}` 
        } 
    });

    const { data: VOTE_STATUS, loading: voteStatusLoading } = useFetch<{ upvote: boolean, downvote: boolean }>({ 
        url: `/api/${subject === "POST" ? "posts" : "comments"}/vote/getVote`, 
        bodyParams: { 
            "USER_ID": `${USER_ID}`, 
            [`${subject.toLowerCase()}ID`]: `${subjectID}` 
        }
    });
    
    useEffect(() => {
        if (TOTAL_VOTES) {
            setTotalUpvotes(TOTAL_VOTES.upvotes || 0);
            setTotalDownvotes(TOTAL_VOTES.downvotes || 0);
        }
    }, [TOTAL_VOTES, totalVotesLoading]);

    useEffect(() => {
        if (VOTE_STATUS) {
            setUpvoted(VOTE_STATUS.upvote || false);
            setDownvoted(VOTE_STATUS.downvote || false);
        }
    }, [VOTE_STATUS , voteStatusLoading]);

    // const token = localStorage.getItem("bearer_token");

    // Could probably simplify these functions, but that's for later.
    const upvote = useCallback(() => {
        if (upvoted === false) {
            // Moving the setStates up here makes it feel way faster due to no API delay. If it fails, it"s reversed.
            setTotalUpvotes(prev => prev + 1);
            setUpvoted(true);
            if (downvoted) setTotalDownvotes(prev => prev - 1);
            setDownvoted(false);
            fetch(`/api/${subject === "POST" ? "posts" : "comments"}/vote/upvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "USER_ID": `${USER_ID}`, [`${subject.toLowerCase()}ID`]: `${subjectID}` })
            })
            .then((res) => {
                if (res.status === 200) return res.json();                    
                else {
                    setTotalUpvotes(prev => prev - 1);
                    setUpvoted(prev => !prev);
                    if (downvoted) setTotalDownvotes(prev => prev + 1);
                    // setDownvoted(prev => !prev);
                }
                createToast({ variant: "Error", title: t("Error.FailedUpvote.Title"), description: t("Error.FailedUpvote.Description") })
            })
        } else if (upvoted === true) {
            setUpvoted(false);
            setTotalUpvotes(prev => Math.max(prev - 1, 0));
            fetch(`/api/${subject === "POST" ? "posts" : "comments"}/vote/upvote/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "USER_ID": `${USER_ID}`, [`${subject.toLowerCase()}ID`]: `${subjectID}` })
            })
            .then((res) => {
                if (res.status === 200) return res.json();
                else {
                        setUpvoted(prev => !prev);
                        setTotalUpvotes(prev => prev + 1);
                }
                createToast({ variant: "Error", title: t("Error.FailedRemoveUpvote.Title"), description: t("Error.FailedRemoveUpvote.Description") })
            })
        }
    }, [downvoted, upvoted, subject, subjectID, SESSION_ID, USER_ID, t]);

    const downvote = useCallback(() => {
        if (downvoted === false) {
            setDownvoted(true);
            setTotalDownvotes(prev => prev + 1);
            if (upvoted) setTotalUpvotes(prev => prev - 1);
            setUpvoted(false);
            fetch(`/api/${subject === "POST" ? "posts" : "comments"}/vote/downvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "USER_ID": `${USER_ID}`, [`${subject.toLowerCase()}ID`]: `${subjectID}` })
            })
            .then((res) => {
                if (res.status === 200) return res.json();                    
                else {
                    setDownvoted(prev => !prev);
                    setTotalDownvotes(prev => prev - 1);
                    if (upvoted) setTotalUpvotes(prev => prev + 1);
                    // setUpvoted(prev => !prev);
                }
                createToast({ variant: "Error", title: t("Error.FailedDownvote.Title"), description: t("Error.FailedDownvote.Description") })
            })
        } else if (downvoted === true) {
            setDownvoted(false);
            setTotalDownvotes(prev => prev - 1);
            fetch(`/api/${subject === "POST" ? "posts" : "comments"}/vote/downvote/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "USER_ID": `${USER_ID}`, [`${subject.toLowerCase()}ID`]: `${subjectID}` })
            })
            .then((res) => {
                if (res.status === 200) return res.json();
                else {
                    setDownvoted(prev => !prev);
                    setTotalDownvotes(prev => prev + 1);
                }
                createToast({ variant: "Error", title: t("Error.FailedRemoveDownvote.Title"), description: t("Error.FailedRemoveDownvote.Description") })
            })  
        }
    }, [downvoted, upvoted, subject, subjectID, SESSION_ID, USER_ID, t]);

    if (totalVotesLoading || voteStatusLoading) {
        return (
            <div className="bg-border animate-pulse w-[117px] h-[36px] rounded-sm" />
        );
    }

    return (
        <div className="flex">
            <Button variant="outline" onClick={() => upvote()} className="!rounded-r-none">
                <ChevronUp className={`${upvoted ? "!text-green-300" : "text-foreground"} w-4 h-4`} />
                <Label className={upvoted ? "!text-green-300" : ""}>{totalUpvotes.toString()}</Label>
            </Button>
            <Button variant="outline" onClick={() => downvote()} className="!rounded-l-none !border-l-0">
                <ChevronUp className={`${downvoted ? "!text-red-300" : "text-foreground"} w-4 h-4`} />
                <Label className={downvoted ? "!text-red-300" : ""}>{totalDownvotes.toString()}</Label>
            </Button>
        </div>
    );
}

export function SignedOutVoteButton({ postID }: { postID: string }) {
    const [totalUpvotes, setTotalUpvotes] = useState<number>(0);
    const [totalDownvotes, setTotalDownvotes] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const t = useTranslations("Components.Post.Vote");

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

    if (isLoading || totalUpvotes === undefined || totalDownvotes === undefined) {
        return (
            <div className="bg-border animate-pulse w-[117px] h-[36px] rounded-sm" />
        );
    }

    return (
        <div className="flex">
            <Button variant="outline" className="!rounded-r-none" onClick={() => toast.error(t("Error.Login.Title"))}>
                <ChevronUp className={`text-foreground w-4 h-4`} />
                <Label>{totalUpvotes}</Label>
            </Button>
            <Button variant="outline" className="!rounded-l-none !border-l-0" onClick={() => toast.error(t("Error.Login.Title"))}>
                <ChevronUp className={`text-foreground w-4 h-4`} />
                <Label>{totalDownvotes}</Label>
            </Button>
        </div>
    );
}