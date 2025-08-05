"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";

export default function Breadcrumbs() {
    const PATHNAME = usePathname();
    const PATH_SEGMENTS = PATHNAME.split("/").filter(Boolean);

    const t = useTranslations("Layout.Breadcrumbs")

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:flex">
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {PATH_SEGMENTS.map((segment, index) => {
                    const HREF= "/" + PATH_SEGMENTS.slice(0, index + 1).join("/");
                    const IS_LAST = index === PATH_SEGMENTS.length - 1;

                    const URI_SEGMENT = decodeURIComponent(segment)
                    const FIRST_LETTER_CAPITAL = URI_SEGMENT.charAt(0).toUpperCase()
                    const REMAINING_LETTERS = URI_SEGMENT.slice(1)
                    let CAPITALIZED_ROUTE_SEGMENT = FIRST_LETTER_CAPITAL + REMAINING_LETTERS

                    if (CAPITALIZED_ROUTE_SEGMENT === "C") CAPITALIZED_ROUTE_SEGMENT = t("Communities")

                    return (
                        <React.Fragment key={index}>
                            {!IS_LAST && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem className="hidden md:flex">
                                        <BreadcrumbLink href={HREF}>{CAPITALIZED_ROUTE_SEGMENT}</BreadcrumbLink>
                                    </BreadcrumbItem>                                
                                </>
                            )}
                        
                            {IS_LAST && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{CAPITALIZED_ROUTE_SEGMENT}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}