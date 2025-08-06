import LanguageSwitcher from "@/components/navigation/languageSwitcher";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Github, Network } from "lucide-react";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import RefreshPageButton from "./refresh-page-button";

import "@/app/themes.css";

export const metadata: Metadata = {
    title: 'Service Unavailable',
    description: 'Service is currently unavailable. Please try again later.',
}

export default async function CriticalErrorPage() {
    const t = await getTranslations("CriticalErrorPage");
    const LOCALE = await getLocale();
	const MESSAGES = await getMessages();
    
    return (
        <html lang={LOCALE} className="dark theme-zinc">
            <body>
                <NextIntlClientProvider messages={MESSAGES} locale={LOCALE}>
                    <div className="h-screen w-screen items-center justify-center bg-background text-foreground px-3">
                        <div className="flex flex-col gap-4 h-full max-w-[450px] w-fit items-center justify-center mx-auto">
                            <div className="text-center py-5 rounded-sm shadow-md border bg-card">
                                <h1 className="text-xl font-semibold mb-4 px-6">
                                    {process.env.NODE_ENV === "development" 
                                        ? t("Title.DevelopmentMode")
                                        : t("Title.ProductionMode")
                                    }
                                </h1>
                                <hr className="mb-5 mt-5" />
                                <p className="text-muted-foreground text-sm max-w-md mx-auto px-6">
                                    {process.env.NODE_ENV === "development" 
                                        ? t("Description.DevelopmentMode")
                                        : t("Description.ProductionMode")
                                    }
                                </p>
                            </div>
                            <div className="text-center py-5 gap-2 rounded-sm shadow-md border bg-card w-full px-6 flex">
                                <LanguageSwitcher />
                                <div className="ml-auto" />
                                {process.env.STATUS_URL !== "null" && process.env.STATUS_URL !== "" && process.env.STATUS_URL !== undefined && 
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={"outline"} size={"icon"} asChild><a href={process.env.STATUS_URL}><Network /></a></Button>
                                        </TooltipTrigger>
                                        <TooltipContent>{t("SystemStatus")}</TooltipContent>
                                    </Tooltip>                                
                                }
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={"outline"} size={"icon"}><Github /></Button>    
                                    </TooltipTrigger>
                                    <TooltipContent>GitHub</TooltipContent>
                                </Tooltip>
                                <RefreshPageButton tooltipText={t("RefreshPage")} />
                            </div>
                        </div>
                    </div>            
                </NextIntlClientProvider>                
            </body>
        </html>
    );
}
