"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";

export default function PageHeading({ title }: { title: string }) {
    return (
        <Card className={"w-full !flex !flex-row !items-center justify-between overflow-hidden mb-4"}>
            <CardTitle className="px-6 !text-xl">{title}</CardTitle>
        </Card>
    );
}

export function CommunityHeading({ communityName, bgImageURL = "https://placehold.co/1652x140" }: { communityName: string, bgImageURL: string }) {

    const t = useTranslations("Components.CommunityHeading")
    const IS_MOBILE = useIsMobile();

    if (IS_MOBILE) {
        return (
            <Card className={"w-full !flex !flex-col overflow-hidden"}>
                <CardTitle className="px-6 !text-xl">{communityName}</CardTitle>
                <CardContent>
                    <Button variant={"default"} disabled>
                        <Plus />
                        {t("Join")}
                    </Button>
                </CardContent>
            </Card>
        );
    } else {
        return (
            <Card className={"w-full !flex !flex-row !items-center justify-between overflow-hidden"}>
                <CardTitle className="px-6 !text-xl">{communityName}</CardTitle>
                <CardContent>
                    <Button variant={"default"} disabled>
                        <Plus />
                        {t("Join")}
                    </Button>
                </CardContent>
            </Card>
        );        
    }
}