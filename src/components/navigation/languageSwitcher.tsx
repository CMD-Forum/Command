"use client";

import useHasMounted from "@/lib/hooks/data/useHasMounted";
import clsx from "clsx";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactElement, startTransition } from "react";
import { Locale } from "../../../translation/i18n/config";
import { setUserLocale } from "../../../translation/services/locale";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";

export default function LanguageSwitcher({ 
    trigger,
    forceDark = false
}: { 
    trigger?: ReactElement;
    forceDark?: boolean;
}) {

    const hasMounted = useHasMounted();

    const t = useTranslations("Layout.LanguageSwitcher");
    const LOCALE = useLocale();

    const onChange = (value: string) => {
        const LOCALE = value as Locale;
        startTransition(() => {
            setUserLocale(LOCALE);
        });
    }

    if (!hasMounted) return <Skeleton className="w-29 h-9" />;

    return (
        <Select
            defaultValue={LOCALE} 
            onValueChange={onChange}
        >
            <SelectTrigger icon={<Globe />}>
                {trigger || 
                    <SelectValue placeholder={t("Language")} />
                }
            </SelectTrigger>
            <SelectContent className={clsx(forceDark ? "dark" : "")}>
                <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ga">Gaeilge</SelectItem>
                    <SelectItem value="fr" disabled>Français</SelectItem>
                    <SelectItem value="es" disabled>Español</SelectItem>
                    <SelectItem value="it" disabled>Italiano</SelectItem>
                    <SelectItem value="pl" disabled>Polski</SelectItem>
                    <SelectItem value="ru" disabled>русский</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Middle East</SelectLabel>
                    <SelectItem value="ar" disabled>عربي</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Asia</SelectLabel>
                    <SelectItem value="ja" disabled>日本語</SelectItem>
                    <SelectItem value="ko" disabled>한국어</SelectItem>
                    <SelectItem value="zh-Hans" disabled>简体中文 (Simplified)</SelectItem>
                    <SelectItem value="zh-Hant" disabled>繁體中文 (Traditional)</SelectItem>
                    <SelectItem value="hi" disabled>हिंदी</SelectItem>
                    <SelectItem value="vi" disabled>Tiếng Việt</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}