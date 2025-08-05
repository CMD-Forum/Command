"use client";

import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import React, { MouseEventHandler, use, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";
import Button from "../button/button";
import Typography from "../misc/typography";
import DialogContext from "./dialogContext";

/**
 * ## Dialog
 * ---
 * Component that overlays the screen with a message.
 * @param {React.ReactNode} children
 * @param {boolean} closeButton If true, then a small X close button is displayed in the top right corner.
 */

export default function Dialog({
    children,
    closeButton = true,
    title,
    subtitle,
    icon,
    alert,
    "aria-label": ariaLabel,
    alignment = "left"
}: {
    children: React.ReactNode;
    closeButton?: boolean;
    title?: string;
    subtitle?: string,
    icon?: React.ReactElement | boolean;
    alert?: boolean;
    "aria-label"?: string;
    alignment?: "center" | "left";
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const DIALOG_REF = useRef(null);

    return (

        <DialogContext.Provider 
            value={{ 
                isOpen, 
                setIsOpen, 
                closeButton, 
                isMounted, 
                setIsMounted, 
                title, 
                subtitle,
                icon, 
                dialogRef: DIALOG_REF,
                alert,
                "aria-label": ariaLabel,
                alignment
            }}
        >
            {children}
        </DialogContext.Provider>
    );
}


/**
 * ## ControlledDialog
 * ---
 * Component that overlays the screen with a message. Controlled means that it uses an external variable.
 * @param {React.ReactNode} children
 * @param {boolean} isOpen Variable that determines if the dialog is open or not.
 * @param {any} setIsOpen Function that changes the variable to true or false.
 * @param {boolean} closeButton If true, then a small X close button is displayed in the top right corner.
 */

export function ControlledDialog({
    children,
    isOpen,
    setIsOpen,
    closeButton = false,
    title,
    subtitle,
    icon,
    alert,
    "aria-label": ariaLabel,
    alignment = "left",
}: {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (_arg0: boolean) => void;
    closeButton?: boolean;
    title?: string;
    subtitle?: string;
    icon?: React.ReactElement | boolean;
    alert?: boolean;
    "aria-label"?: string;
    alignment?: "center" | "left";
}) {

    const [isMounted, setIsMounted] = useState<boolean>(false);
    const DIALOG_REF = useRef(null);

    return (
        <DialogContext.Provider 
            value={{ 
                isOpen, 
                setIsOpen, 
                closeButton, 
                isMounted, 
                setIsMounted, 
                title,
                subtitle, 
                icon, 
                dialogRef: DIALOG_REF,
                alert,
                "aria-label": ariaLabel,
                alignment
            }}
        >
            {children}
        </DialogContext.Provider>
    );
}

Dialog.Controlled = ControlledDialog

/**
 * ## DialogContent
 * ---
 * Main part of the `Dialog` component.
 * @param {React.ReactNode} children
 */

export function DialogContent({ 
    children,
    className,
}: { 
    children: React.ReactNode,
    className?: string,
}) {
    const { 
        isOpen, 
        setIsOpen, 
        closeButton, 
        isMounted, 
        setIsMounted, 
        title, 
        subtitle,
        icon, 
        dialogRef: DIALOG_REF,
        alert,
        "aria-label": ariaLabel,
        alignment
    } = use(DialogContext);
    
    useEffect(() => { setIsMounted(true) });
    
    useEffect(() => { if (isOpen && DIALOG_REF.current) DIALOG_REF.current.focus() }, [isOpen, DIALOG_REF]);
    useEffect(() => { document.body.style.overflowY = isOpen ? "hidden" : "scroll" }, [isOpen]); 

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation(); 
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => { document.removeEventListener("keydown", handleKeyDown) };
    }, [setIsOpen])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const dialogNode = DIALOG_REF.current;
            if (dialogNode && !dialogNode.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);

        return () => { document.removeEventListener("mousedown", handleClickOutside) };
    }, [DIALOG_REF, isOpen, setIsOpen])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!DIALOG_REF.current) return;
            if (event.key === "Tab" && DIALOG_REF.current) {
                const FOCUSABLE_ELEMENTS = DIALOG_REF.current.querySelectorAll(
                    "a, button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
                ) as NodeListOf<HTMLElement>;

                if (FOCUSABLE_ELEMENTS.length === 0) return;

                const FIRST_ELEMENT = FOCUSABLE_ELEMENTS[0];
                const LAST_ELEMENT = FOCUSABLE_ELEMENTS[FOCUSABLE_ELEMENTS.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === FIRST_ELEMENT) {
                        event.preventDefault();
                        LAST_ELEMENT.focus();
                    }
                } else {
                    if (document.activeElement === LAST_ELEMENT) {
                        event.preventDefault();
                        FIRST_ELEMENT.focus();
                    }
                }
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => { document.removeEventListener("keydown", handleKeyDown) };
    }, [DIALOG_REF, isOpen])

    return isMounted ? (
        <>
            {createPortal(
                <AnimatePresence mode="wait">
                    {isOpen &&
                        <m.div
                            className="fixed w-screen max-h-screen h-screen inset-0 flex items-center justify-center z-[999999999] bg-new-grey-900/50 p-6 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            id="dialog-container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <m.div
                                initial={{ opacity: 0, y: "0.5rem" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "0.5rem" }}
                                transition={{ duration: 0.2 }}
                                className={`${className} bg-background border border-new-grey-600 rounded-sm text-wrap h-fit max-h-full my-6 !min-w-[350px] max-w-[500px] overflow-x-hidden shadow-md flex flex-col outline-none relative ${alignment === "center" ? "items-center justify-center" : ""}`}
                                tabIndex={0}
                                ref={DIALOG_REF}
                                role={ alert === true ? "alertdialog" : "dialog" }
                                aria-label={ariaLabel || title}
                            >
                                { (title || icon || closeButton) ? (
                                    <div className="h-fit w-full flex flex-col justify-between gap-1 p-6">
                                        <div className={`flex items-center ${alignment === "center" ? "justify-center flex-col gap-1" : "justify-start gap-4"}`} >
                                            {React.isValidElement(icon) && React.cloneElement(icon, { // If the prop has a component (and not a boolean, see below), then clone it.
                                                className: `${alignment === "center" ? "w-7 h-7" : "w-5 h-5"} text-white`,
                                                ...(icon.props as React.HTMLProps<HTMLElement>)
                                            })}
                                            { icon === true && <ExclamationCircleIcon className="w-5 h-5 text-white" /> } {/* If no icon is specified but the prop is true, default to a warning icon. */}
                                            { title !== undefined && <Typography variant="h4">{title}</Typography> }
                                        </div>
                                        { subtitle !== undefined && <Typography variant="p" secondary centered={alignment === "center"} className={clsx(icon && "ml-9")}>{subtitle}</Typography> }
                                        { closeButton && <Button variant="Ghost" className=" !text-secondary hover:text-white focus:text-white !absolute right-1 top-1 !rounded-full" square onClick={() => setIsOpen(false)} aria-label="Close Dialog" icon={<XMarkIcon />} />}
                                    </div>
                                ): null }
                                <DialogContext.Provider value={{ isOpen, setIsOpen, isMounted, setIsMounted, closeButton, title, dialogRef: DIALOG_REF }}>
                                    { children }
                                </DialogContext.Provider>
                            </m.div>
                        </m.div>
                    }
                </AnimatePresence>,
                document.body
            )}         
        </>
    ) : null;
}

Dialog.Content = DialogContent

/**
 * ## DialogTitle
 * ---
 * Title for the `Dialog` component.
 * @param {React.ReactNode} children
 * @param {string} className Optional, and discouraged, but there if you want to use it.
 */

/*export function DialogTitle ({ 
    children, 
    className = "", 
    ...other 
}: { 
    children: React.ReactNode, 
    className?: string 
}) {
    return (
        <h2 className={`text-xl font-semibold max-w-full text-wrap px-6 pr-14 pt-6 ${className ? className : null}`} {...other}>{ children }</h2>    
    );
}

Dialog.Title = DialogTitle*/

/**
 * ## DialogSubtitle
 * ---
 * Subtitle for the `Dialog` component.
 * @param {React.ReactNode} children
 * @param {string} className Optional, and discouraged, but there if you want to use it.
 * @deprecated
 */

export function DialogSubtitle ({ 
    children, 
    className = "", 
    ...other 
}: { 
    children: React.ReactNode, 
    className?: string 
}) {
    return (
        <Typography variant="p" className={`text-secondary ${className}`} {...other}>{ children }</Typography>    
    );
}

Dialog.Subtitle = DialogSubtitle

/**
 * ## DialogButton
 * ---
 * Button for the `Dialog` component.
 * @param {React.ReactNode} children
 * @param {string} className Optional, and discouraged, but there if you want to use it.
 * @param {string} type Type of button (see `navlink` css classes).
 * @param {boolean} loadingVariable If you want the button to show a spinner when a variable is true, then set this to that variable.
 * @param {string} spinnerColor Deprecated, do not use. Now handled automatically.
 * @param {MouseEventHandler<HTMLButtonElement>} onClick
 * @deprecated
 */

export function DialogButton ({ 
    children, 
    className = "", 
    type, 
    loadingVariable, 
    // Below is for compatibility reasons
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    spinnerColor,
    onClick,
    ...other 
}: { 
    children: React.ReactNode, 
    className?: string, 
    type: "navlink" | "navlink-full" | "navlink-destructive" | "navlink-sidebar" | "navlink-ghost", 
    loadingVariable?: boolean, 
    spinnerColor: "white" | "black", 
    onClick?: MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <button className={`${type} ${className} !w-full md:!w-fit justify-center transition-all`} onClick={onClick} {...other}>
            { }
            { loadingVariable === true ? <img src={`/spinner_${type === "navlink-full" ? "black" : "white"}.svg`} alt="Loading..." className="spinner"/>  : children }
            { ! loadingVariable ? null : children }
        </button>        
    );
}

Dialog.Button = DialogButton

/**
 * ## DialogButtonContainer
 * ---
 * Wrapper for the `DialogButton` component.
 * @param {React.ReactNode} children
 * @param {string} className Optional, but there if you want to use it.
 */

export function DialogButtonContainer ({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <div className={"flex justify-end gap-2 p-4 bg-[#0d0d0f] mt-6"}>
            { children }
        </div>
    );
}

Dialog.ButtonContainer = DialogButtonContainer

/**
 * ## DialogBody
 * ---
 * Wrapper for the `Dialog` component.
 * @param {React.ReactNode} children
 * @param {string} className Optional, but there if you want to use it.
 */

export function DialogBody ({ 
    children, 
    className 
}: { 
    children: React.ReactNode, 
    className?: string 
}) {
    return (
        <div className={`px-6 pb-6 overflow-scroll max-w-[350px] md:max-w-[750px] lg:max-w-[900px] 2xl:max-w-[1024px] ${className}`}>
            { children }
        </div>        
    );
}

Dialog.DialogBody = DialogBody

/**
 * ## DialogCloseButton
 * ---
 * Close button for the `Dialog` component.
 * @param {React.ReactNode} children
 */

export function DialogCloseButton ({
    children,
}: { 
    children: React.ReactElement,
}) {
    const CONTEXT = use(DialogContext);
    return (
        React.cloneElement(
            children,
            { 
                onClick: () => CONTEXT.setIsOpen(false),
                ...children.props as React.HTMLProps<HTMLElement>
            }
        )
    );
}

Dialog.CloseButton = DialogCloseButton

/**
 * ## DialogCloseButton
 * ---
 * Close button for the `Dialog` component.
 * @param {React.ReactNode} children
 */

export function DialogTrigger ({
    children,
}: { 
    children: React.ReactNode,
}) {
    const CONTEXT = use(DialogContext);

    const handleClick = () => {
        CONTEXT.setIsOpen(true);
        setTimeout(() => {
            if (CONTEXT.dialogRef.current && CONTEXT.isOpen) {
                CONTEXT.dialogRef.current.focus();
            }
        }, 600);
    }

    return (
        React.isValidElement(children) && React.cloneElement(
            children,
            {
                onClick: handleClick,
                ...children.props as React.HTMLProps<HTMLElement>
            }
        )
    );
}

Dialog.Trigger = DialogTrigger