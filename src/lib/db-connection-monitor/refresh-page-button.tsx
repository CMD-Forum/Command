"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";

export default function RefreshPageButton({ tooltipText }: { tooltipText: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant={"outline"} 
                    size={"icon"}
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
    );
}