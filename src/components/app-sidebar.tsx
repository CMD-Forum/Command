"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { useTranslations } from "next-intl";
import { NavCommunities } from "./nav-communities";
import NavSecondary from "./nav-secondary";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  // const t = useTranslations("Layout.Sidebar.NavMain");

  return (
    <Sidebar collapsible="icon" {...props}>
      {/*<SidebarHeader>
        <Label asChild><a href="/" className="!font-extrabold !px-2 !mt-1 !text-2xl">Command</a></Label>
      </SidebarHeader>*/}
      <SidebarContent>
        <NavMain />
        <NavCommunities />
        <div className="mt-auto" />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
