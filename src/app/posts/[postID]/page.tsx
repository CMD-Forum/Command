"use client";

import { getPost } from "@/lib/data";
import { useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { Suspense } from "react";

import { CommunitySidebarDataAPIResponse } from "@/app/api/v2/community/getSidebarData/byName/[communityName]/route";
import CommunitySidebar from "@/components/community/communitySidebar";
import { ListError } from "@/components/misc/listError";
import { FullPost } from "@/components/posts/post";
import { FullPostSkeleton } from "@/components/skeletons/Post";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunity } from "@/lib/context/community";
import { useQuery } from "@tanstack/react-query";
import { Article, WithContext } from "schema-dts";

export default function PostView() {

	const PARAMS = useParams<{ postID: string }>();
	const { community, setCommunity, setInformation, setMembers, setPosts } = useCommunity();
	const t = useTranslations("Components.PostView");

	const { 
		data: FETCHED_POST, 
		isLoading: FETCHED_POST_IS_LOADING,
		isError: FETCHED_POST_IS_ERROR,
		error: FETCHED_POST_ERROR,
		refetch: FETCHED_POST_REFETCH
	} = useQuery({
        queryKey: ["post_view_post", PARAMS.postID],
        queryFn: async () => {
			if (!PARAMS.postID) notFound();

            const res = await getPost({ postID: PARAMS.postID });
			if (!res) notFound();
			if (res.errorCode === 401 || res.errorCode === 403) throw new Error(res.error);

            // const data = await res.json();
            return res.response;
        },
        retry: 1
    });

	if (FETCHED_POST_IS_ERROR) return <ListError 
		title={t("Error.SomethingWentWrong.Title")} 
		subtitle={t("Error.SomethingWentWrong.Subtitle")}
		reloadButton
		reloadFunction={FETCHED_POST_REFETCH}
	/>

	if (FETCHED_POST_ERROR === "Post is private.") return <ListError title={t("Error.Private.Title")} />

	const { 
		data: FETCHED_SIDEBAR_DATA, 
		isLoading: FETCHED_SIDEBAR_DATA_IS_LOADING, 
		isError: FETCHED_SIDEBAR_DATA_IS_ERROR, 
		error: FETCHED_SIDEBAR_DATA_ERROR, 
		refetch: FETCHED_SIDEBAR_DATA_REFETCH 
	} = useQuery<CommunitySidebarDataAPIResponse>({
        queryKey: ["post_view_sidebar", FETCHED_POST?.communityId ?? null],
        queryFn: async () => {
			if (!PARAMS.postID) throw new Error();

			const res = await fetch(`/api/v2/community/getSidebarData/byID/${FETCHED_POST?.communityId ?? "unknown" }`);
			if (!res.ok) throw new Error("Failed to fetch community data.");

            const data = await res.json();

			if (community?.name !== data.community.name) {
				setCommunity(data.community);
				setInformation({
					about: data.information.about,
					rules: data.information.rules,
					moderators: data.information.moderators,
					related_communities: data.information.related_communities,
				});
				setMembers(data.members);
				setPosts(data.posts);
			}

            return data;
        },
		enabled: !!FETCHED_POST,
        retry: 1
    });

	const jsonLd: WithContext<Article> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		name: FETCHED_POST?.title,
		image: FETCHED_POST?.imageurl || "/metadata/banner/Banner-1920x1080.png",
		description: typeof FETCHED_POST?.content === "string" && FETCHED_POST.content.length > 150
  			? FETCHED_POST.content.slice(0, 150) + "..."
  			: FETCHED_POST?.content ?? ""
	}

  	return (
		<Suspense fallback={<FullPostSkeleton />}>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      		/>
			<div>
				<div className="flex flex-row gap-6">
					{FETCHED_POST_IS_LOADING ? (
						<FullPostSkeleton />
					) : (
						FETCHED_POST ? (
							<FullPost
								id={FETCHED_POST.id}
								title={FETCHED_POST.title}
								author={FETCHED_POST.author}
								community={FETCHED_POST.community}
								createdAt={FETCHED_POST.createdAt}
								updatedAt={FETCHED_POST.updatedAt}
								public={FETCHED_POST.public}
								content={FETCHED_POST.content}
								image={FETCHED_POST.imageurl}
								imagealt={FETCHED_POST.imagealt}
								imageblur={FETCHED_POST.imageblur}
								href={FETCHED_POST.href}
							/>
						) : (
							<ListError title={t("Error.NotFound.Title")} subtitle={t("Error.NotFound.Subtitle")} />
						)				
					)}

					{FETCHED_SIDEBAR_DATA_IS_LOADING ? (
						<Skeleton className="w-[500px] h-[342px] rounded-sm" />
					) : (
						<CommunitySidebar />
					)}
					
				</div>
			</div>			
		</Suspense>
  	);
}