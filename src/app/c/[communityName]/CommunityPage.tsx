import CommunitySidebar from "@/components/community/communitySidebar";
import { CommunityHeading } from "@/components/navigation/pageHeading";
import PostList from "@/components/posts/post_list";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";

export default function CommunityPage({ 
    communityPromise
}: {
    communityPromise: Promise<{
        name: string;
        bg_image: string;
    } | null>
}) {

    const community = use(communityPromise);
    if (!community) return notFound();

    return (
        <>
            <Suspense fallback={<Skeleton className="rounded-sm shadow-sm w-full h-[86px]" />}>
                <CommunityHeading communityName={`c/${community.name}`} bgImageURL={community.bg_image} />
            </Suspense>
            <div className="flex w-full">		
                <main className="w-full mt-4">
                    <div className="flex flex-row gap-6">
                        {/*<UserSidebar />*/}
                        <Suspense fallback={
                            <>
                                <Skeleton className="rounded-sm shadow-sm w-full h-[86px]" />
                                <Skeleton className="rounded-sm shadow-sm w-full h-[139px]" />
                                <Skeleton className="rounded-sm shadow-sm w-full h-[34px]" />
                            </>
                        }>
                            <PostList url={`/api/posts/getAll/byCommunityName/${community.name}`} />
                        </Suspense>
                        <Suspense fallback={<Skeleton className="rounded-sm shadow-sm w-[500px] h-[342px]" />}>
                            <CommunitySidebar />
                        </Suspense>
                    </div>
                </main>
            </div>
        </>
    );
}