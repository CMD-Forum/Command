"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function LogoutCard() {

    const t = useTranslations("Settings");
    const { data: session } = authClient.useSession();
    const router = useRouter();
    
    return (
        <Card className="!pb-0 !max-w-[1200px]">
            <CardHeader>
                <CardTitle>{t("Logout")}</CardTitle>
                <CardDescription>{t("LogoutDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="!bg-transparent !border-t !pt-3 !pb-3 !w-full !flex">
                <div className="ml-auto" />
                <Button variant="destructive" onClick={() => { 
                    authClient.revokeSession({ token: session?.session.token || "" })
                    router.push("/");
                }}>
                    {t("Logout")}
                </Button>
            </CardContent>
        </Card>
    );
}