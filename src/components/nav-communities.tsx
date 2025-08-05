"use client"

import {
	BookMarked,
	ChevronRight,
	EthernetPort,
	Loader2Icon,
	LogIn,
	PlusIcon
} from "lucide-react"

import {
	SidebarGroupLabel,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

export function NavCommunities() {

	const [communities, setCommunities] = useState<{ name: string, image: string }[] | null>([]);
	const [CommunitiesLoading, setCommunitiesLoading] = useState<boolean>(true);
	const [CommunitiesError, setCommunitiesError] = useState<boolean>(false);

	const t = useTranslations("Layout.Sidebar.NavCommunities");
	const { data: SESSION } = authClient.useSession();

	// const token = localStorage.getItem("bearer_token");

	useEffect(() => {
			setCommunitiesLoading(true);
			if (SESSION?.user?.id) {
				fetch("/api/v2/account/data/getJoinedCommunities", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						// "Authorization": `Bearer ${token}`,
					}
				})
				.then((res) => {
					if (!res.ok) setCommunitiesError(true);
					return res.json();
				})
				.then((data) => {
					if (data.response !== null) setCommunities(data.response.communities);
					else setCommunities(null);
				})
				.finally(() => setCommunitiesLoading(false));
			} else {
				setCommunitiesLoading(false);
			}
	}, [SESSION]);

	return (
		<div className="px-2">
			<SidebarGroupLabel>{t("Other")}</SidebarGroupLabel>
			<Collapsible
				asChild
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton tooltip={t("JoinedCommunities")}>
							<EthernetPort />
							<span>{t("JoinedCommunities")}</span>
							<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{!SESSION?.user?.id &&
							<SidebarMenuSubItem>
								<SidebarMenuSubButton asChild>
									<Link href="/login">
										<LogIn />
										<span>{t("LoginMessage")}</span>
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						}
						{communities && communities.map((community) => (
							<SidebarMenuSubItem key={community.name}>
								<SidebarMenuSubButton asChild>
								<Link href={`/c/${community.name}`}>
									<span>{community.name}</span>
								</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
						{(!communities || communities === null || communities === undefined) &&
							<SidebarMenuSubButton asChild>
								<a href="/c/">
								<PlusIcon />
								<span>{t("NoCommunities")}</span>
								</a>
							</SidebarMenuSubButton>
						}
						{CommunitiesLoading && 
							<div className="flex gap-2">        
								<Loader2Icon
								className={cn(
									"text-muted absolute animate-spin",
									"loading",
								)}
								/>
								<span>{t("LoadingCommunities")}</span>
							</div>
						}
					</SidebarMenuSub>
				</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
			<SidebarMenuButton tooltip={t("SavedPosts")} asChild>
				<a href="/posts/saved">
					<BookMarked />
					<span>{t("SavedPosts")}</span>
				</a>
			</SidebarMenuButton>
		</div>
	)
}
