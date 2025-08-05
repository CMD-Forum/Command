"use client";

import { BellIcon } from "@heroicons/react/16/solid";
import { useTranslations } from "next-intl";
import Button from "../button/button";
import Menu, { MenuContent, MenuTrigger } from "../menu/menu";
import Typography from "../misc/typography";
import { TabContent, Tabs } from "../tabs/tabs";

export default function NotificationMenu() {
    const t = useTranslations("Layout.Topbar.NotificationMenu");
    return (
        <Menu defaultPlacement="top-end">
            <MenuTrigger><Button variant="Ghost" square={true} icon={<BellIcon />} aria-label={t("Notifications")} /></MenuTrigger>
            <MenuContent className="!pb-4 !pt-0 !px-0 rounded-sm">
                <Tabs className="!px-2 !pb-2" style="pills" bottomBorder>
                    <TabContent label={t("Tabs.DirectMessages")}>
                        <div className="px-6">
                            <Typography variant="p" secondary={true}>{t("Tabs.DirectMessages")}</Typography>     
                        </div>
                    </TabContent>
                    <TabContent label={t("Tabs.Replies")}>
                        <div className="px-6">
                            <Typography variant="p" secondary={true}>{t("Tabs.Replies")}</Typography>    
                        </div>
                    </TabContent>
                    <TabContent label={t("Tabs.Misc")}>
                        <div className="px-6">
                            <Typography variant="p" secondary={true}>{t("Tabs.Misc")}</Typography>    
                        </div>
                    </TabContent>
                </Tabs>
                {/*<div className="hover:bg-BtnSecondary_Hover p-4 rounded-sm max-w-[400px]">
                    <Typography variant="h5">Command V1.5 Released</Typography>
                    <Typography variant="p" className="overflow-hidden text-ellipsis whitespace-nowrap text-secondary">Command Version 1.5 was released today, featuring an entire overhaul of the UI and other improvements.</Typography>
                </div>
                <hr />
                <div className="hover:bg-BtnSecondary_Hover p-4 rounded-sm max-w-[400px]">
                    <Typography variant="h5">Welcome to Command!</Typography>
                    <Typography variant="p" className="overflow-hidden text-ellipsis whitespace-nowrap text-secondary">It looks like you&apos;ve just signed up, click here for a tour!</Typography>                            
                </div>*/}
            </MenuContent>
        </Menu>
    );
}