"use client";

import { BookmarkIcon, PlusIcon } from "@heroicons/react/16/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { createUserMembershipRecord, deleteUserMembershipRecord, getAllUserMembershipRecords } from "../../lib/data";

/**
 * @deprecated Import from `@/app/(general)/ui/posts/save_post_button.tsx` instead.
 */

export function SavePostButton({ 
    userID, 
    postID 
}: { 
    userID: string, 
    postID: string 
}) {

    // TO-DO: Optimize this because it makes 10 requests each page load

    const [saved, setSaved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    useEffect(() => {
        setIsLoading(true); 
        fetch("/api/posts/checkSaved", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
        })
        .then((res) => {
            if ( res.status === 400 ) {
                setSaved(true);
            } else {
                setSaved(false);
            }            
            setIsLoading(false);
            return res.json();
        })        
    }, [postID, userID])

    function SavePost() {
        if ( saved === false ) {
            fetch("/api/posts/savePost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
            })
            .then((res) => {
                setSaved(true);
                return res.json();
            })
        } else if ( saved === true ) {
            fetch("/api/posts/unsavePost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
            })
            .then((res) => {
                if ( res.status === 200 ) {
                    setSaved(false);
                }         
                return res.json();
            })  
        }
    }

    if ( isLoading ) {
        return (
            <div className="navlink animate-pulse !bg-border"><span className="text-border">Save</span></div>
        );
    }

    return (
        <button className={`navlink !px-2 md:!px-3 ${saved ? "!bg-border" : "" }`} onClick={() => SavePost()} aria-label="Save Post">
            { saved ? <BookmarkIcon className="w-5 h-5" /> : <BookmarkIconOutline className='w-5 h-5' /> }
            <span className='hidden md:flex'>{ saved ? "Saved" : "Save" }</span>
        </button>
    );
}

export function JoinCommunityButton ({
    communityID,
    userID,
    showLabelOnMobile = false,
}: {
    communityID: string,
    userID: string | undefined,
    showLabelOnMobile?: boolean,
}) {

    const [isMember, setIsMember] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setError("");
        setIsLoading(true);
        async function fetchUserMembership() {
            try {
                if ( userID ) {
                    const memberships = await getAllUserMembershipRecords({ userID: userID });
                    if ( memberships ) {
                        setIsMember(memberships.memberships.some((membership: any) => membership.community.id === communityID));
                        setIsLoading(false);
                    }
                } else {
                    setIsLoading(false);
                }                
            } 
            catch (error) {
                console.error(error);
                setError("We couldn't get your membership status.")
                setIsLoading(false);
            }
        }
        fetchUserMembership();
    }, [communityID, userID])

    const joinCommunity = async () => {
        try {
            setIsLoading(true);
            // @ts-ignore
            await createUserMembershipRecord({ userID: userID, communityID: communityID }); 
            setIsMember(true);  
            setIsLoading(false);
        } catch {
            console.log(error);
            setError("We couldn't add you to this community right now.");
            setIsLoading(false);
        }
    }

    const leaveCommunity = async () => {
        try {
            setIsLoading(true);
            // @ts-ignore
            await deleteUserMembershipRecord({ userID: userID, communityID: communityID })
            setIsMember(false);           
            setIsLoading(false); 
        } catch (error) {
            console.log(error);
            setError("We couldn't remove you from this community right now.")
            setIsLoading(false);
        }
    }

    if ( isLoading ) {
        return (
            <div className="navlink animate-pulse !bg-border !text-border"><PlusIcon className="font-medium w-5 h-5" />Joined</div>
        );
    }

    return userID ? (
        <button className={`navlink justify-center items-center ${showLabelOnMobile ? "" : "!px-2 md:!px-3"}`} data-navlink-enabled={isMember ? "true" : "false"} onClick={isMember ? () => leaveCommunity() : () => joinCommunity()}>
            <PlusIcon className="font-medium h-5 w-5" />
            <p className={`items-center h-full ${showLabelOnMobile ? "flex" : "hidden md:flex"}`}>{ isMember ? "Joined" : "Join"}</p>
        </button>
    ) : null;
}