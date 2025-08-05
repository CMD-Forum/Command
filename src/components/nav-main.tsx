"use client"

import { EthernetPort, HomeIcon, TextSearch } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl";

export function NavMain() {

  	const t = useTranslations("Layout.Sidebar.NavMain");

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t("Pages")}</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuButton tooltip={t("Home")} asChild>
					<a href="/">
						<HomeIcon />
						<span>{t("Home")}</span>
					</a>
				</SidebarMenuButton>
				<SidebarMenuButton tooltip={t("Communities")} asChild>
					<a href="/c/">
						<EthernetPort />
						<span>{t("Communities")}</span>
					</a>
				</SidebarMenuButton>
				<SidebarMenuButton tooltip={t("Topics")} asChild>
					<a href="/topics/">
						<TextSearch />
						<span>{t("Topics")}</span>
					</a>
				</SidebarMenuButton>
			</SidebarMenu>
		</SidebarGroup>
	)
}
