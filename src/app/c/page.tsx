"use client";

import CommunityList from "@/components/community/communityList";
import CommunitySidebar from "@/components/community/communitySidebar";
import PageHeading from "@/components/navigation/pageHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export const experimental_ppr = true;

export default function CommunityPage() {

    const t = useTranslations("/c");

    const LOADING_SKELETONS = [];
    for (let i = 0; i < 10; i++) LOADING_SKELETONS.push(<Skeleton className="h-[138px] !rounded-sm" key={i} />);

    return (
        <div>
            <PageHeading title={t("Community")} />
            <main className="pageMain">
                <div className="flex flex-row gap-6">
                    <Suspense fallback={<div className="flex flex-col gap-4 w-full">{LOADING_SKELETONS}</div>}>
                        <CommunityList />                
                    </Suspense>
                    <Suspense fallback={<Skeleton className="w-[500px] min-w-[500px] h-[342px]" />}>
                        <CommunitySidebar />    
                    </Suspense>
                </div>
            </main>
        </div>
    );
}