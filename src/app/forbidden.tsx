"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Forbidden() {

    const t = useTranslations("Layout.Forbidden");
    const ROUTER = useRouter();

    return (
        <div className="flex flex-col h-[calc(100vh-60px)] justify-center items-center">
            <h1 className="text-9xl mb-4 font-bold">403</h1>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{t("Title")}</h2>
            <h3 className="text-sm !font-semibold md:text-base !text-muted-foreground text-center">{t("Subtitle")}</h3>
            <div className="flex gap-4 mt-8">
                <Button variant={"outline"} onClick={() => ROUTER.back()}>{t("GoBack")}</Button>
                <Button variant={"default"} asChild><a href="/">{t("ReturnHome")}</a></Button>
            </div>
        </div>
    );
}