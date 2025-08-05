import PageHeading from "@/components/navigation/pageHeading";
import DeleteAccountCard from "@/components/settings/DeleteAccountCard";
import LogoutCard from "@/components/settings/LogoutCard";
import SessionsCard from "@/components/settings/SessionsCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth/auth";
import { AvatarImage } from "@radix-ui/react-avatar";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function Settings() {

    const t = await getTranslations("Settings");
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <>
            <PageHeading title={t("Settings")}  />
            <div className="flex flex-row gap-3 mt-4 mb-4 h-full">
                <Tabs orientation="vertical" defaultValue="account" className="w-full lg:!flex-row !gap-6 !h-full">
                    <TabsList className="shrink-0 grid grid-cols-1 gap-1 !w-full lg:!max-w-[300px] !h-fit">
                        <TabsTrigger value="account" className="!text-left">{t("Account")}</TabsTrigger>
                        <TabsTrigger value="privacy">{t("Privacy")}</TabsTrigger>
                        <TabsTrigger value="notifications">{t("Notifications")}</TabsTrigger>
                        <TabsTrigger value="preferences">{t("Preferences")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="!flex !flex-col !gap-4">
                        <Card className="!max-w-[1200px]">
                            <CardHeader className="!flex !flex-row !gap-4">
                                <Avatar className="h-10 w-10 rounded-sm">
                                    { session?.user?.image && <AvatarImage src={session?.user?.image} /> }
                                    { session?.user?.username && <AvatarFallback className="rounded-lg">{session.user?.username.slice(0,2).toUpperCase()}</AvatarFallback> }
                                </Avatar>
                                <div className="!flex !flex-col !gap-1 !w-full !h-full !grow-0">
                                    <CardTitle>{session?.user.username}</CardTitle>
                                    <CardDescription>{session?.user.description}</CardDescription>                                    
                                </div>
                            </CardHeader>
                        </Card>

                        <SessionsCard />
                        <LogoutCard />
                        <DeleteAccountCard />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}