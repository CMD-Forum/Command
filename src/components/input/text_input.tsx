"use client";

import React, { useEffect, useId, useState } from "react";

import { ClipboardDocumentListIcon, ClipboardIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { RefCallBack } from "react-hook-form";
import CopyButton from "../misc/copyButton";
import PasteButton from "../misc/pasteButton";

// These are imported dynamically as they are only needed if using the visibility toggle
const EyeIcon = dynamic(() => import("@heroicons/react/16/solid").then(mod => mod.EyeIcon), { ssr: false, loading: () => <div className="animate-pulse bg-border rounded-sm !absolute !h-4 !w-4 !p-1 right-[5px] top-[5px] !items-center !justify-center" /> });
const EyeSlashIcon = dynamic(() => import("@heroicons/react/16/solid").then(mod => mod.EyeSlashIcon), { ssr: false, loading: () => <div className="animate-pulse bg-border rounded-sm !absolute !h-4 !w-4 !p-1 right-[5px] top-[5px] !items-center !justify-center" /> });
const Button  = dynamic(() => import("../button/button"), { ssr: false, loading: () => <div className="animate-pulse bg-border rounded-sm !absolute !h-7 !w-7 !p-1 right-1.5 top-1.5 !items-center !justify-center" /> });

interface ExtendedTextInput extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    value?: string | number | readonly string[] | undefined;
    defaultValue?: string | number | readonly string[] | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    ref?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | RefCallBack;
    type?: string;
    inputID?: string;
    inputName?: string;
    className?: string;
    error?: boolean;
    textArea?: boolean;
    widthFull?: boolean;
    variant?: "Standard" | "Outlined";
    visibilityToggle?: boolean;
    pasteButton?: boolean;
    copyButton?: boolean;
    minHeight?: number | boolean;
    icon?: React.ReactElement;
    endIcon?: React.ReactElement;
    small?: boolean;
}

export default function TextInput({
    textArea, 
    inputID, 
    inputName, 
    className, 
    error, 
    type = "text", 
    value, 
    defaultValue = undefined,
    label,
    onChange,
    widthFull = true,
    variant = "Standard",
    visibilityToggle = type === "password" ? true : false,
    pasteButton = false,
    copyButton = false,
    minHeight,
    ref,
    icon,
    endIcon,
    small,
    ...restProps
}: ExtendedTextInput ) {
    const COMPONENT_ID = useId();
    const [isActive, setIsActive] = useState(false);
    const [showText, setShowText] = useState<boolean>(false);

    useEffect(() => {
        setIsActive(!!(value || defaultValue));
    }, [value, defaultValue]);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (restProps.onBlur) restProps.onBlur(event);
        setIsActive(!!event.target.value);
    };

    if (minHeight === true) minHeight = 140;

    const INPUT_CLASSNAMES = clsx(
        "text-input placeholder:!text-secondary !bg-background block w-full px-4 py-3 text-sm rounded-sm appearance-none peer border border-border text-white",
        error && "!border-red-300 focus:!outline-red-300",
        icon && "!pl-10",
        endIcon && "!pr-10",
        small && "small",
        className
    );

    const LABEL_CLASSNAMES = clsx(
        "absolute left-2.5 transition-all duration-300 bg-transparent z-10",
        isActive ? "text-white -translate-y-[18px] scale-75 top-2.5" : `text-secondary top-1/2 -translate-y-1/2`,
        isActive ? "after:content-[''] after:absolute after:left-0 after:top-[9px] after:w-full after:h-[4px] after:bg-grey-one after:-z-10" : "",
        error ? "!text-red-300" : ""
    );
    return (
        <div className={`relative ${widthFull && "!w-full"}`}>
            {React.createElement(
                textArea ? "textarea": "input",
                {
                    ref: ref,
                    id: inputID || COMPONENT_ID,
                    name: inputName || undefined,
                    className: INPUT_CLASSNAMES,
                    type: showText ? showText === true ? "text" : "password" : "text",
                    style: { minHeight: textArea ? (minHeight || 38): 0 },
                    value: value,
                    defaultValue: defaultValue || null,
                    onChange: onChange,
                    onFocus: () => setIsActive(true),
                    onBlur: handleBlur,
                    placeholder: variant === "Outlined" ? "" : label,
                    role: "textbox",
                    ...restProps
                }
            )}
            {variant === "Outlined" &&
                <label 
                    htmlFor={inputID || COMPONENT_ID} 
                    aria-label={`${label} Input`}
                    className={LABEL_CLASSNAMES}
                >
                    {label}
                </label>
            }
            {visibilityToggle && <Button variant="Secondary" className="!absolute !h-7 !w-7 !p-1 right-1.5 top-1.5 !items-center !justify-center" onClick={() => setShowText(!showText)} icon={showText ? <EyeSlashIcon /> : <EyeIcon />} /> }
            <div className="absolute left-3 top-2.5 w-fit flex gap-1.5 items-center justify-center">
                {icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<Partial<{ className: string }>>, {
                    className: `w-5 h-5 ${isActive ? "!text-white" : "!text-secondary"}`,
                    onClick: (event: React.MouseEvent<HTMLElement>) => {
                        const PROPS = icon.props as { onClick?: (event: React.MouseEvent) => void }
                        if (PROPS.onClick) PROPS.onClick(event);
                        if (ref && typeof ref === "object" && ref.current) ref.current.focus();
                        else if (ref && typeof ref === "function") ref((node: HTMLElement) => node.focus());
                    },
                    ...(icon.props as React.HTMLProps<HTMLElement>)
                })}
            </div>
            <div className="absolute right-1.5 top-1.5 w-fit flex gap-1.5 items-center justify-center">
                {pasteButton &&
                    <PasteButton 
                        trigger={
                            <button type="button" title="Paste" className="btnSecondary cursor-pointer !h-7 !w-7 !p-1.5 !items-center !justify-center"><ClipboardDocumentListIcon className="w-4 h-4" /></button>
                        }
                        inputRef={ref && typeof ref !== "function" ? ref : undefined}
                    />
                }
                {copyButton &&
                    <CopyButton
                        trigger={
                            <button type="button" title="Copy" className="btnSecondary cursor-pointer !h-7 !w-7 !p-1.5 !items-center !justify-center"><ClipboardIcon className="w-4 h-4" /></button>
                        }
                        inputRef={ref && typeof ref !== "function" ? ref : undefined}
                    />
                }                
            </div>
            <div className="absolute right-3 top-2.5 w-fit flex gap-1.5 items-center justify-center">
                {endIcon && React.isValidElement(endIcon) && React.cloneElement(endIcon as React.ReactElement<Partial<{ className: string }>>, {
                    className: `w-5 h-5 ${isActive ? "!text-white" : "!text-secondary"}`,
                    onClick: (event: React.MouseEvent<HTMLElement>) => {
                        const PROPS = endIcon.props as { onClick?: (event: React.MouseEvent) => void }
                        if (PROPS.onClick) PROPS.onClick(event);
                        if (ref && typeof ref === "object" && ref.current) ref.current.focus();
                        else if (ref && typeof ref === "function") ref((node: HTMLElement) => node.focus());
                    },
                    ...(endIcon.props as React.HTMLProps<HTMLElement>)
                })}
            </div>            
        </div>
    );
}

TextInput.displayName = "TextInput"