"use client";

import { useLocale, useTranslations } from "next-intl";
import Select, { SelectContent, Option } from "../select/select";
import { ReactElement, startTransition, useState } from "react";
import { setUserLocale } from "../../../translation/services/locale";
import { Locale } from "../../../translation/i18n/config";
import { MenuButton } from "../menu/menu";
import { GB, IE, DE } from "country-flag-icons/react/3x2"

export default function LanguageSwitcher({ 
    style = "Select", 
    btnClassName, 
    icon,
}: { 
    style?: "Select" | "List";
    btnClassName?: string;
    icon?: ReactElement;
}) {

    const t = useTranslations("Layout.LanguageSwitcher");
    const LOCALE = useLocale();

    const [selectedValue, setSelectedValue] = useState(LOCALE);

    const onChange = (value: string) => {
        const LOCALE = value as Locale;
        startTransition(() => {
          setUserLocale(LOCALE);
          setSelectedValue(LOCALE);
        });
    }
    
    if (style === "Select") {
        return (
            <Select
                label={t("Language")} 
                defaultSelection={t(`Languages.${selectedValue === "en" ? "English" : "German"}`)} 
                onSelect={onChange}
                btnClassName={btnClassName}
                icon={icon}
            >
                <SelectContent>
                    <Option label="English" value="en" icon={<GB />} />
                    <Option label="Gaeilge" value="ga" icon={<IE />} />
                    <Option label="Deutsch" value="de" icon={<DE />} />
                </SelectContent>
            </Select>
        );        
    } else {
        return (
            <div className="flex flex-col">
                <MenuButton onClick={() => onChange("en")} icon={<GB title={t("Languages.English")} />}>English</MenuButton>
                <MenuButton onClick={() => onChange("ga")} icon={<IE title={t("Languages.Gaeilge")} />}>Gaeilge</MenuButton>
                <MenuButton onClick={() => onChange("de")} icon={<DE title={t("Languages.German")} />}>Deutsch</MenuButton>
            </div>
        );
    }
}