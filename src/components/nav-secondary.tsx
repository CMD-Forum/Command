"use client";

import { HelpCircle, Send, SunMoon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { useTranslations } from "next-intl";

export default function NavSecondary() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    const t = useTranslations("Layout.Sidebar.NavSecondary")

    return (
        <div className="px-2">
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("GetHelp")}>
                    <a href={"/help"}>
                        <HelpCircle />
                        <span>{t("GetHelp")}</span>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("Feedback")}>
                    <a href={"/feedback"}>
                        <Send />
                        <span>{t("Feedback")}</span>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                <SidebarMenuButton asChild>
                <label>
                    <SunMoon />
                    <span>Dark Mode</span>
                    {mounted ? (
                        <Switch
                            className="ml-auto"
                            checked={resolvedTheme !== "light"}
                            onCheckedChange={() =>
                                setTheme(resolvedTheme === "dark" ? "light" : "dark")
                            }
                        />
                    ) : (
                        <Skeleton className="ml-auto h-4 w-8 rounded-full" />
                    )}
                </label>
                </SidebarMenuButton>
            </SidebarMenuItem>            
        </div>
    );
}