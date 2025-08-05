"use client";

import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Button from "../button/button";
import Typography from "../misc/typography";

export interface AlertProps {
    variant: "notice" | "warning" | "success" | "error",
    children: React.ReactNode, 
    className?: string,
    closeBtn?: boolean,
}

/**
 * ## Alert
 * ---
 * @param variant The type of alert. If unsure, think about the severity of what"s happening in the alert.
 * @param style The style of the alert, can be  `subtle`, `left-accent` or `top-accent`.
 * @param children You should pass `<AlertTitle>` and/or `<AlertDescription>` for the children.
 * @param [className] Optionally provide CSS styling.
 * @example
 * <Alert type={"notice"} style={"subtle"}>
 *     <AlertTitle>Notice to all users.</AlertTitle>
 *     <AlertSubtitle>The website will be down for maintenance from 9:00am to 14:30pm GMT.</AlertSubtitle>
 * </Alert> 
 */

export default function Alert({ 
    variant = "notice",
    children, 
    className,
    closeBtn = true,
}: AlertProps) { 
    const [visible, setVisible] = useState(true);

    const ICON_MAP = {
        notice: <div className="w-5 !h-full items-center"><InformationCircleIcon color="white" className="w-5 h-5" /></div>,
        warning: <div className="w-5 !h-full items-center"><ExclamationTriangleIcon color="#fb923c" className="w-5 h-5" /></div>,
        success: <div className="w-5 !h-full items-center"><CheckCircleIcon color="#4ade80" className="w-5 h-5" /></div>,
        error: <div className="w-5 !h-full items-center"><ExclamationCircleIcon color="#ef4444" className="w-5 h-5" /></div>
    }

    const ALERT_CLASSES = clsx(
        "w-full transition-all rounded-sm px-3 py-3 items-center",
        variant === "notice" && "bg-alert-notice",
        variant === "warning" && "bg-alert-warning",
        variant === "success" && "bg-alert-success",
        variant === "error" && "bg-alert-error",
        className
    );

    const t = useTranslations("Components.Alert");

    if (visible)
        return (
            <div className={ALERT_CLASSES} tabIndex={0} role="alert" aria-atomic>
                <div className="flex flex-row items-centre gap-3 h-fit">
                    {ICON_MAP[variant]}
                    <div className="flex flex-col h-fit">{children}</div>
                    { closeBtn && 
                        <Button variant="Ghost" className="!shadow-none !bg-transparent !absolute !right-4 !top-4" icon={<XMarkIcon />} onClick={() => setVisible(false)} aria-label={t("CloseAlert")} />
                    }
                </div>
            </div>
        );
    else return null;

}

export const AlertTitle = ({ children, className = "", ...other }: { children: React.ReactNode, className?: string }) => (
    <Typography variant="p" className={clsx(className)} {...other}>{ children }</Typography>
)

AlertTitle.displayName = "AlertTitle"
Alert.Title = AlertTitle

export const AlertSubtitle = ({ children, className = "", ...other }: { children: React.ReactNode, className?: string }) => (
    <Typography variant="p" secondary className={clsx(className)} {...other}>{ children }</Typography>
)

AlertSubtitle.displayName = "AlertSubtitle"
Alert.Subtitle = AlertSubtitle