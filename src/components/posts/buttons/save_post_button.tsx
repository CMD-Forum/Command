"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

export function SavePostButton({ 
    userID,
    postID,
    menuTrigger,
}: {
    userID: string;
    postID: string;
    menuTrigger?: boolean;
}) {

    const t = useTranslations("Components.Post.SaveButton");

    const [saved, setSaved] = useState<boolean>(false);

    // const { data: SESSION } = authClient.useSession();
    const isMobile = useIsMobile();
    // const token = localStorage.getItem("bearer_token");

    function SavePost() {
        if (saved === false) {
            setSaved(true);
            fetch(`/api/posts/savePost/${postID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
                },
            })
            .then((res) => {
                if (res.status !== 201) setSaved(false);
                return res.json();
            })
        } else if (saved === true) {
            setSaved(false);
            fetch(`/api/posts/unsavePost/${postID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
                },
            })
            .then((res) => {
                if (res.status !== 200) setSaved(true);
                return res.json();
            })  
        }
    }

    const { isLoading } = useQuery({
        queryKey: ['save_post', /*token,*/ postID, userID],
        queryFn: async () => {
            const res = await fetch(`/api/posts/checkSaved/${postID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}`);
            if (res.status === 401) setSaved(false);

            const data = await res.json();
            setSaved(data === true);

            return data;
        },
        retry: 1
    });

    if (isLoading && menuTrigger === false) return <div className="bg-border animate-pulse w-[83px] h-[36px] rounded-sm" />
   
    if (menuTrigger === true) {
        return (
            <Toggle
                variant="outline"
                onClick={() => SavePost()} 
                aria-label="Save Post" 
                className="!border-none !w-full !justify-start"
            >
                <Bookmark stroke="var(--muted-foreground)" fill={saved ? "var(--muted-foreground)" : "transparent"} />
                { saved ? t("Saved") : t("Save") }
            </Toggle>
        );
    } else {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Toggle
                            variant="outline"
                            onClick={() => SavePost()} 
                            aria-label="Save Post" 
                            className={`dark:bg-input/30 transition-all dark:hover:bg-input/50`}
                        >
                            <Bookmark fill={saved ? "var(--foreground)" : "transparent"} />
                        </Toggle>                        
                    </TooltipTrigger>
                    <TooltipContent>
                        { !isMobile && <span>{ saved ? t("Unsave") : t("Save") }</span> }   
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
}