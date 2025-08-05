"use client";

import { LoadingSpinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div>
            <div className="w-full h-[calc(100dvh-60px)] flex items-center justify-center">
                <LoadingSpinner className="size-12" />
            </div>            
        </div>
    );
}