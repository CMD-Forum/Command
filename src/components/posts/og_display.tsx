"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { og } from "@/types";
import Typography from "../misc/typography";

export default function OpengraphDisplay({ url }: { url: string }) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [ogData, setOgData] = useState<og>();

    useEffect(() => {
        setIsLoading(true);
        setError("");
        fetch(`/api/ogs/${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            res.json().then((body) => {
                if (res.status === 200) {
                    setOgData(body);
                    setIsLoading(false);
                } else {
                    setError("Sorry, this link couldn't be fetched.")
                    setIsLoading(false);
                }
            })
        })
    }, [url])

    if (isLoading) {
        return (
            <div className="w-full bg-border animate-pulse border-1 border-border rounded-sm p-4">
                <div className="flex flex-col">
                    <Link href={url || "#"} className="!mb-0"><Typography variant="p" className="bg-border animate-pulse text-Border w-fit">{url.replace(/^https?:\/\//i, "").replace("/", "") || "URL could not be retrieved."}</Typography></Link>
                    <Link href={url || "#"} className="!mb-0"><Typography variant="h5" className="bg-border animate-pulse text-Border">{url || "URL couldn't be retrieved."}</Typography></Link>
                </div>
                <div>
                    <Typography variant="p" className="!mb-0 bg-border animate-pulse text-Border">Loading...</Typography>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-foreground border-1 border-border rounded-sm p-4">
                <div className="flex flex-col">
                    <Link href={url || "#"} className="!mb-0"><Typography variant="p" className="hover:underline text-secondary hover:!text-white transition-all w-fit">{url.replace(/^https?:\/\//i, "").replace("/", "") || "URL could not be retrieved."}</Typography></Link>
                    <Link href={url || "#"} className="!mb-0"><Typography variant="h5">{url || "URL couldn't be retrieved."}</Typography></Link>
                </div>
                <div>
                    <Typography variant="p" className="!mb-0 text-secondary">The link information couldn&apos;t be retrieved.</Typography>
                </div>
            </div>
        );
    }

    if (ogData) {
        return (
            <div className="w-full bg-foreground border-1 border-border rounded-sm p-4">
                <div className="flex flex-col">
                    <Link href={url || "#"} className="!mb-0"><Typography variant="p" className="hover:underline text-secondary hover:!text-white transition-all w-fit">{url.replace(/^https?:\/\//i, "").replace("/", "") || "URL could not be retrieved."}</Typography></Link>
                    <Link href={url || "#"} className="!mb-0"><Typography variant="h5">{ogData.result.ogTitle}</Typography></Link>
                </div>
                <div>
                    <Typography variant="p" className="!mb-0 text-secondary">{ogData.result.ogDescription || "The link information couldn&apos;t be retrieved."}</Typography>
                </div>
            </div>
        );        
    } else {
        return (
            <div className="w-full bg-foreground border-1 border-border rounded-sm p-4">
                <div className="flex flex-col">
                    <Link href={url || "#"} className="!mb-0"><Typography variant="p" className="hover:underline text-secondary hover:!text-white transition-all w-fit">{url.replace(/^https?:\/\//i, "").replace("/", "") || "URL could not be retrieved."}</Typography></Link>
                    <Link href={url || "#"} className="!mb-0"><Typography variant="h5">{url || "URL couldn't be retrieved."}</Typography></Link>
                </div>
                <div>
                    <Typography variant="p" className="!mb-0 text-secondary">The link information couldn&apos;t be retrieved.</Typography>
                </div>
            </div>
        );
    }
} 