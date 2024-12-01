"use client";

import { BookmarkIcon } from "@heroicons/react/16/solid";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { useSession } from "@/app/(general)/lib/sessioncontext";

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

    const session = useSession();

    useEffect(() => {
        setIsLoading(true); 
        fetch("/api/posts/checkSaved", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.session?.id}`
            },
            body: JSON.stringify({ "userID": `${userID}`, "postID": `${postID}` })
        })
        .then((res) => {
            if ( res.status === 201 ) {
                setSaved(true);
            } else {
                setSaved(false);
            }            
            setIsLoading(false);
            return res.json();
        })        
    }, [postID, session.session?.id, userID])

    function SavePost() {
        if ( saved === false ) {
            fetch("/api/posts/savePost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.session?.id}`
                },
                body: JSON.stringify({ "postID": `${postID}` })
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
                    "Authorization": `Bearer ${session.session?.id}`
                },
                body: JSON.stringify({ "postID": `${postID}` })
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
            <div className="navlink animate-pulse !bg-border"><span className="text-border flex gap-1"><BookmarkIconOutline className="w-5 h-5" />Save</span></div>
        );
    }

    return (
        <button className={`navlink !px-2 md:!px-3 ${saved ? "!bg-border" : "" }`} onClick={() => SavePost()} aria-label="Save Post">
            { saved ? <BookmarkIcon className="w-5 h-5" /> : <BookmarkIconOutline className='w-5 h-5' /> }
            <span className='hidden md:flex'>{ saved ? "Saved" : "Save" }</span>
        </button>
    );
}