"use client";

import React, { 
    ReactElement, 
    ReactNode, 
    useEffect, 
    useLayoutEffect, 
    // useLayoutEffect, 
    useRef, 
    useState 
} from "react";
import { TOAST_PROMISE, TOAST_TYPES } from "./toast";
import Typography from "../misc/typography";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m"
import { 
    CheckCircleIcon, 
    ExclamationCircleIcon, 
    ExclamationTriangleIcon, 
    InformationCircleIcon 
} from "@heroicons/react/16/solid";

export default function Toast({ 
    variant, 
    title, 
    description,
    duration = 5000,
    buttons,
    promise
}: { 
    variant: TOAST_TYPES;
    title: string;
    description?: string;
    duration?: number;
    buttons?: React.ReactNode;
    promise?: TOAST_PROMISE;
}) {

    const [currentVariant, setCurrentVariant] = useState<TOAST_TYPES>(variant);
    const [currentTitle, setCurrentTitle] = useState<string>(title);
    const [currentDescription, setCurrentDescription] = useState<string | null>(description || null);
    const [currentButtons, setCurrentButtons] = useState<ReactNode>(buttons);

    const [showToast, setShowToast] = useState<boolean>(true);

    const [loading, setLoading] = useState<boolean>(false);

    const TOAST_REF = useRef<HTMLDivElement>(null);
    const [toastWidth, setToastWidth] = useState<number>(288);

    useEffect(() => {
        const hideToast = () => {
            const TIMER = setTimeout(() => {
                if (TOAST_REF.current) TOAST_REF.current.remove();
            }, duration);
    
            return () => clearTimeout(TIMER);
        }

        if (promise) {
            setLoading(true);
            setCurrentVariant(promise.loading.variant || "Notice");
            setCurrentTitle(promise.loading.title);
            setCurrentDescription(promise.loading.description || null);
            setCurrentButtons(promise.loading.buttons);

            promise.promise
                .then(() => {
                    setCurrentVariant(promise.success.variant || "Success");
                    setCurrentTitle(promise.success.title);
                    setCurrentDescription(promise.success.description || null);
                    setCurrentButtons(promise.success.buttons);
                })
                .catch(() => {
                    setCurrentVariant(promise.error.variant || "Error");
                    setCurrentTitle(promise.error.title);
                    setCurrentDescription(promise.error.description || null);
                    setCurrentButtons(promise.error.buttons);
                })
                .finally(() => {
                    setLoading(false);
                    setTimeout(hideToast, duration);
                });
        } else {
            setTimeout(hideToast, duration);
        }
    }, [promise, duration]);

    useLayoutEffect(() => {
        if (TOAST_REF.current) setToastWidth(TOAST_REF.current.offsetWidth);
    }, [TOAST_REF])
    
    const ICON_MAP = {
        Notice: <InformationCircleIcon color="white" className="w-5 h-5" />,
        Warning: <div className="w-5 !h-full items-center"><ExclamationTriangleIcon color="#fb923c" className="w-5 h-5" /></div>,
        Success: <div className="w-5 !h-full items-center"><CheckCircleIcon color="#4ade80" className="w-5 h-5" /></div>,
        Error: <div className="w-5 !h-full items-center"><ExclamationCircleIcon color="#ef4444" className="w-5 h-5" /></div>
    }

    const BG_MAP = {
        Notice: "var(--color-alert-notice)",
        Warning: "var(--color-alert-warning)",
        Success: "var(--color-alert-success)",
        Error: "var(--color-alert-error)"
    }

    const TOAST_ID = `${Date.now()}-${Math.random()}`;
    
    return (
        <AnimatePresence>
            {showToast &&
                <m.div
                    key={TOAST_ID}
                    style={{ backgroundColor: BG_MAP[currentVariant] }}
                    className="rounded shadow-2xl w-fit min-w-80 h-fit py-4 px-6 flex items-center gap-6 disable-scrollbars transition-none"
                    initial={{ top: -50 }}
                    animate={{ top: 0 }}
                    transition={{ duration: 0.15 }}
                    exit={{ top: -50 }}
                    ref={TOAST_REF}
                >
                    <div className="flex flex-row gap-4 items-center">
                        {!loading && ICON_MAP[currentVariant]}
                        {loading && <div className="w-5 h-5 flex items-center !justify-center"><Image src={"/LoadingSpinner.svg"} width={512} height={512} alt="Loading..." className="spinner !w-4 !h-4 animate-spin" /></div>}
                        {/*<Button variant="Ghost" onClick={deleteToast} icon={<XMarkIcon />} square={true} className="!absolute !bg-transparent top-0 right-0 !text-secondary hover:!text-white" />*/}
                        <div className="flex flex-col gap-1 h-fit">
                            <Typography variant="p" className="!text-sm">{currentTitle}</Typography>
                            { currentDescription && <Typography variant="p" className="!text-xs" secondary={true}>{currentDescription}</Typography> }
                        </div>
                        { React.isValidElement(currentButtons) && !loading &&
                            <div className="flex flex-row gap-2 justify-end">
                                { React.cloneElement(buttons as ReactElement) }
                            </div>
                        }
                    </div>
                </m.div>            
            }
        </AnimatePresence>
    );
}