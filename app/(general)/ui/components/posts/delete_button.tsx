"use client";

import { ArchiveBoxXMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

import { useSession } from "@/app/(general)/lib/sessioncontext";

export function DeleteAsAdminButton({ 
    postID,
    btnClassName = "",
}: {
    postID: string,
    btnClassName?: string,
}) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const session = useSession();

    function DeletePost() {
        setIsLoading(true);
        fetch("/api/posts/deletePost/asAdmin", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.session?.id}`
            },
            body: JSON.stringify({ "postID": `${postID}` })
        })
        .then((res) => {
            setIsLoading(false);
            if (res.status === 200) {
                window.location.reload();
            }
            return res.json();
        })
    }

    if ( isLoading ) {
        return (
            <div className="navlink animate-pulse"><span className="flex gap-1"><img src="/spinner_white.svg" className="w-5 h-5 animate-spin" alt="Deleting" />Deleting</span></div>
        );
    }

    return (
        <button className={btnClassName} onClick={() => DeletePost()}><ArchiveBoxXMarkIcon className="w-5 h-5" />Delete</button>
    );
}

export function DeleteAsAuthorButton({ 
    postID,
    btnClassName = "",
}: {
    postID: string,
    btnClassName?: string,
}) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const session = useSession();

    function DeletePost() {
        setIsLoading(true);
        fetch("/api/posts/deletePost/asAuthor", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.session?.id}`
            },
            body: JSON.stringify({ "postID": `${postID}` })
        })
        .then((res) => {
            setIsLoading(false);
            if (res.status === 200) {
                window.location.reload();
            }
            return res.json();
        })
    }

    if ( isLoading ) {
        return (
            <div className="navlink animate-pulse"><span className="flex gap-1"><img src="/spinner_white.svg" className="w-5 h-5 animate-spin" alt="Deleting" />Deleting</span></div>
        );
    }

    return (
        <button className={btnClassName} onClick={() => DeletePost()}><ArchiveBoxXMarkIcon className="w-5 h-5" />Delete</button>
    );
}