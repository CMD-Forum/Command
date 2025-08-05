"use client";

import { ArchiveBoxXMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

import { useTranslations } from "next-intl";
import Button from "../../button/button";

export function DeleteAsModeratorButton({ 
    postID,
    btnClassName = "",
}: {
    postID: string,
    btnClassName?: string,
}) {

    const t = useTranslations("Components.Post.DeleteButton");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const token = localStorage.getItem("bearer_token");

    function DeletePost() {
        setIsLoading(true);
        fetch("/api/posts/deletePost/asAdmin", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "postID": `${postID}` })
        })
        .then((res) => {
            setIsLoading(false);
            if (res.status === 200) window.location.reload();
            return res.json();
        })
    }

    if (isLoading) {
        return (
            <Button variant="Destructive" icon={<img src="/spinner_white.svg" className="animate-spin" alt="Deleting" />} className="animate-pulse">{t("Deleting")}</Button>
        );
    }

    return (
        <Button variant="Destructive" icon={<ArchiveBoxXMarkIcon />} className={btnClassName} onClick={() => DeletePost()}>{t("Delete")}</Button>
    );
}

export function DeleteAsAuthorButton({ 
    postID,
    btnClassName = "",
}: {
    postID: string,
    btnClassName?: string,
}) {

    const t = useTranslations("Components.Post.DeleteButton");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const token = localStorage.getItem("bearer_token");

    function DeletePost() {
        setIsLoading(true);
        fetch("/api/posts/deletePost/asAuthor", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}`
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

    if (isLoading) {
        return (
            <Button variant="Destructive" icon={<img src="/spinner_white.svg" className="animate-spin" alt="Deleting" />} className="animate-pulse">{t("Deleting")}</Button>
        );
    }

    return (
        <Button variant="Destructive" icon={<ArchiveBoxXMarkIcon />} className={btnClassName} onClick={() => DeletePost()}>{t("Delete")}</Button>
    );
}