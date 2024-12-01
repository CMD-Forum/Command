"use client";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from 'framer-motion';
import React, { MouseEventHandler, useContext, useEffect, useState } from "react";
import { createPortal } from 'react-dom';

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
    closeButton = false
}: {
    children: React.ReactNode;
    closeButton?: boolean;
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    return (
        // @ts-ignore
        <DialogContext.Provider value={{ isOpen, setIsOpen, closeButton, isMounted, setIsMounted }}>
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
    closeButton = false
}: {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: any;
    closeButton?: boolean;
}) {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    return (
        // @ts-ignore
        <DialogContext.Provider value={{ isOpen, setIsOpen, closeButton, isMounted, setIsMounted }}>
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
}: { 
    children: React.ReactNode,
}) {

    const { isOpen, setIsOpen, closeButton, isMounted, setIsMounted } = useContext(DialogContext);
    
    useEffect(() => {
        // @ts-ignore
        setIsMounted(true);
    })

    useEffect(() => {
        document.body.style.overflowY = isOpen ? "hidden" : "scroll";
    }, [isOpen]); 

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape') {
                // @ts-ignore
                setIsOpen(false);
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setIsOpen])

    return isMounted ? (
        <>
            {createPortal(
                <AnimatePresence mode="wait">
                    {isOpen &&
                        <motion.div 
                            className='fixed w-screen h-screen inset-0 flex items-center justify-center z-[9999999999999999999999999999999999] bg-semitransparent px-6 overflow-hidden'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ ease: "backOut", duration: 0.3 }} // Stole this off mono-svelte
                                className={`bg-background rounded-lg text-wrap h-fit !min-w-0 !max-w-[1024px] overflow-x-scroll border-border border-0 flex flex-col absolute`}
                                id="dialog-container"
                                tabIndex={0}
                            >
                                { closeButton && 
                                    // @ts-ignore
                                    <button className="w-fit h-fit absolute top-2 right-2 rounded-lg p-1 transition-all hover:bg-border active:bg-card" onClick={() => setIsOpen(false)}>
                                        <XMarkIcon className="w-5 h-5 flex text-white cursor-pointer transition-all"></XMarkIcon>        
                                    </button>
                                }

                                <div className="">
                                    {/* @ts-ignore */}
                                    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
                                        { children }
                                    </DialogContext.Provider>
                                </div>
                            </motion.div>    
                        </motion.div>
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

export function DialogTitle ({ 
    children, 
    className = "", 
    ...other 
}: { 
    children: React.ReactNode, 
    className?: string 
}) {
    return (
        <h2 className={`header-3 font-black max-w-full text-wrap px-6 pt-6 ${className ? className : null}`} {...other}>{ children }</h2>    
    );
}

Dialog.Title = DialogTitle

/**
 * ## DialogSubtitle
 * ---
 * Subtitle for the `Dialog` component.
 * @param {React.ReactNode} children
 * @param {string} className Optional, and discouraged, but there if you want to use it.
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
        <p className={`subtitle text-sm px-6 pb-6 ${className}`} {...other}>{ children }</p>    
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
    // eslint-disable-next-line no-unused-vars
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
            { loadingVariable === true ? <img src={`/spinner_${type === "navlink-full" ? "black" : "white"}.svg`} alt="Loading..." className="spinner"/>  : children }
            { ! loadingVariable ? null : children }
        </button>        
    );
}

// eslint-disable-next-line deprecation/deprecation
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
        <div className={`flex justify-end gap-2 px-6 pb-4 border-t-0 border-border bg-transparent`}>
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
    const context = useContext(DialogContext);
    return (
        React.cloneElement(
            children,
            // @ts-ignore
            { onClick: () => context.setIsOpen(false) }
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
    const context = useContext(DialogContext);
    return (
        React.cloneElement(
            // @ts-ignore
            children,
            {
                // @ts-ignore
                onClick: () => context.setIsOpen(true),
                type: "button"
            }
        )
    );        
}

Dialog.Trigger = DialogTrigger