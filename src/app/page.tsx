"use client";

import { Suspense } from "react";

import CommunitySidebar from "@/components/community/communitySidebar";
import { CommunityHeading } from "@/components/navigation/pageHeading";
import PostList from "@/components/posts/post_list";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAndSetCommunity } from "@/lib/context/community";

export default function Home() {
    
    useFetchAndSetCommunity({ fetchBy: "Name", identifier: "all" });

    const LOADING_SKELETONS = [];
    for (let i = 0; i < 10; i++) LOADING_SKELETONS.push(<Skeleton className="h-[138px] !rounded-sm" key={i} />);

    return (
        <>
            <CommunityHeading communityName="c/all" bgImageURL="" />
            <div className="flex flex-row gap-6 mt-4 mb-4">
                <Suspense fallback={<div className="flex flex-col gap-4 w-full">{LOADING_SKELETONS}</div>}>
                    <PostList
                        url="/api/posts/getAll"
                        method="GET"
                    />                    
                </Suspense>
                <Suspense fallback={<Skeleton className="w-[500px] min-w-[500px] h-[342px]" />}>
                    <CommunitySidebar />    
                </Suspense>
            </div>
        </>
    );
}