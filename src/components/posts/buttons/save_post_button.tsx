"use client";

import { Dispatch, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
// import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

export function SavePostButton({ 
    userID,
    postID,
    menuTrigger,
    saved, 
    setSaved
}: {
    userID: string;
    postID: string;
    menuTrigger?: boolean;
    saved: boolean;
    setSaved: Dispatch<SetStateAction<boolean>>;
}) {

    const t = useTranslations("Components.Post.SaveButton");

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
                console.log("SavePost response status:", res.status);
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
                console.log("SavePost response status:", res.status);
                if (res.status !== 200) setSaved(true);
                return res.json();
            })  
        }
    }

    // if (isLoading && menuTrigger === false) return <div className="bg-border animate-pulse w-[83px] h-[36px] rounded-sm" />
   
    if (menuTrigger === true) {
        return (
            <Button 
                onClick={() => SavePost()} 
                variant="ghost" 
                className="!justify-start !font-medium"
                aria-label={t("SavePost")}
            >
                <Bookmark stroke="white" fill={saved ? "white" : "transparent"} />
                { saved ? t("Saved") : t("Save") }
            </Button>
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