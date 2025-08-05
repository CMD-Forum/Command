"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function SessionsCard() {

    const t = useTranslations("Settings");
    const { data: session } = authClient.useSession();
    
    return (
        <Card className="!pb-0 !max-w-[1200px]">
            <CardHeader>
                <CardTitle>{t("Sessions")}</CardTitle>
                <CardDescription>{t("SessionsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="!bg-transparent !border-t !pt-3 !pb-3 !w-full !flex">
                <div className="ml-auto" />
                <Button variant="default" asChild>
                    <Link href={"/settings/sessions"}>{t("ViewSessions")}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}