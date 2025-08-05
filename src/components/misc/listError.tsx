"use client";

import { ListRestart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export function ListError({
    title,
    subtitle,
    reloadButton = true,
    reloadFunction = () => location.reload(),
    children,
}: {
    title?: string;
    subtitle?: string;
    reloadButton?: boolean;
    reloadFunction?: () => void;
    children?: React.ReactNode;
}) {

    const t = useTranslations("Components.ListError")
    
    return (
        <Card className="!w-full !h-fit !items-center !justify-center">
            <CardHeader className="!w-full !items-center !justify-center">
                <CardTitle className="!text-center">{title || t("DefaultTitle")}</CardTitle>
                <CardDescription className="!text-center">{subtitle || t("DefaultSubtitle")}</CardDescription>
            </CardHeader>
            {(reloadButton || children) &&
                <CardFooter className="!w-full !items-center !justify-center">
                    {reloadButton && <Button variant="default" onClick={reloadFunction}><ListRestart />{t("Reload")}</Button>}
                    {children}
                </CardFooter>
            }
        </Card>
    );
}