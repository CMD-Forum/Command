"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  EthernetPort,
  LogIn,
  LogOut,
  NotebookText,
  Plus,
  Settings,
  UserPlus
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth/auth-client"
import { useTranslations } from "next-intl"
import Logout from "./auth/logout/logout_button"

export function NavUser() {
  const { isMobile } = useSidebar()
  const t = useTranslations("Layout.Sidebar.NavUser")
  const { data: SESSION } = authClient.useSession();

  if (SESSION?.user?.id) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  { SESSION.user.image && <AvatarImage src={SESSION.user?.image} /> }
                  { SESSION.user.username && <AvatarFallback className="rounded-lg">{SESSION.user?.username.slice(0,2).toUpperCase()}</AvatarFallback> }
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{SESSION.user?.username}</span>
                  <span className="truncate text-xs">{SESSION.user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    { SESSION.user.image && <AvatarImage src={SESSION.user?.image} /> }
                    { SESSION.user.username && <AvatarFallback className="rounded-lg">{SESSION.user?.username.slice(0,2).toUpperCase()}</AvatarFallback> }
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{SESSION.user?.username}</span>
                    <span className="truncate text-xs">{SESSION.user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-[0.5rem]"><Plus className="text-muted-foreground w-[1rem] h-[1rem]" />{t("Create.Create")}</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild>
                        <a href="/create/post">
                          <NotebookText />
                          {t("Create.Post")}
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/create/community">
                          <EthernetPort />
                          {t("Create.Community")}
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile">
                    <BadgeCheck />
                    {t("Profile")}                
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/notifications">
                    <Bell />
                    {t("Notifications")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">
                    <Settings />
                    {t("Settings")}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="!h-[32px] !px-2">
                <Logout icon={<LogOut />} text={t("Logout")} variant="ghost" className="!h-[32px] !p-0 !bg-transparent" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  } else {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">?</AvatarFallback>
                </Avatar>                
                <div className="grid flex-1 text-left text-sm">
                  <span className="truncate font-medium">{t("LoggedOutTitle")}</span>
                  <span className="truncate text-xs">{t("LoggedOutSubtitle")}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <a href="/login">
                    <LogIn />
                    {t("Login")}                
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/signup">
                    <UserPlus />
                    {t("Signup")}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>             
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
}
