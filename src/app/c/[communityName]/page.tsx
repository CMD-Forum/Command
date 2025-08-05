import CommunitySidebar from "@/components/community/communitySidebar";
import CommunityHeading from "@/components/navigation/pageHeading";
import PostList from "@/components/posts/post_list";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";

export async function generateMetadata(
	{ params }: { params: { communityName: string } },
): Promise<Metadata> {
	const { communityName } = await params;
	return {
		title: communityName ? `c/${communityName}` : "Command",
	}
}

export default function Page({ params }: { params: Promise<{ communityName: string }> }) {
	const awaitedParams = use(params);
	const community = use(db.community.findUnique({
		where: { name: awaitedParams.communityName },
		select: { name: true, bg_image: true },
	}));

	if (!community) return notFound();

	return (
		<>
			<Suspense fallback={<Skeleton className="rounded-sm shadow-sm w-full h-[86px]" />}>
				<CommunityHeading title={`c/${community.name}`} />
			</Suspense>

			<div className="flex w-full">
				<main className="w-full mt-4">
					<div className="flex flex-row gap-6">
						<Suspense fallback={<Skeleton className="rounded-sm shadow-sm w-full h-[86px]" />}>
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