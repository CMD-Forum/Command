"use client";

import { 
    createContext, 
    createElement, 
    useCallback, 
    use, 
    useEffect,
} from "react";
import { createRoot } from "react-dom/client"
import Toast from "./toastComponent";

export type TOAST_CONTEXT_TYPE = { createToastFunc: (_options: { type: string; title: string; description: string }) => void; }
export type TOAST_TYPES = "Notice" | "Warning" | "Success" | "Error"
export type TOAST_PROMISE = { 
    promise: Promise<unknown>; 
    success: { 
        variant?: TOAST_TYPES; 
        title: string; 
        description?: string;
        buttons?: React.ReactNode;
    }; 
    error: { 
        variant?: TOAST_TYPES;
        title: string; 
        description?: string;
        buttons?: React.ReactNode;
    };
    loading: {
        variant?: TOAST_TYPES;
        title: string;
        description?: string;
        buttons?: React.ReactNode;
    }
}
export type TOAST_PROPS = { 
    variant: TOAST_TYPES; 
    title: string; 
    description?: string; 
    buttons?: React.ReactNode;
    promise?: TOAST_PROMISE;
}

const TOAST_CONTEXT = createContext<TOAST_CONTEXT_TYPE | undefined>(undefined);
const CREATE_TOAST_REF = { current: null as ((_options: TOAST_PROPS) => void) | null };

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    /**
     * ## createToastFunc
     * ---
     * Creates a toast with the specified parameters.
     * 
     * @param variant *Defaults to Notice*. The type of toast.
     * @param title The title of the toast.
     * @param description The description of the toast.
     * @param duration *Defaults to 5000*. The duration of the toast, in milliseconds.
     */
    const createToastFunc = useCallback(({ 
        variant = "Notice",
        title, 
        description, 
        duration = 5000,
        buttons,
        promise
    }: { 
        variant?: TOAST_TYPES;
        title: string;
        description?: string;
        duration?: number;
        buttons?: React.ReactNode;
        promise?: TOAST_PROMISE;
    }) => {
        const TOAST_CONTAINER = document.getElementById("Toaster");
        if (TOAST_CONTAINER === null) return null;

        const TOAST_ELEMENT = document.createElement("div");
        TOAST_ELEMENT.className = "w-fit m-auto"
        TOAST_CONTAINER.appendChild(TOAST_ELEMENT);

        const ROOT = createRoot(TOAST_ELEMENT);
        ROOT.render(createElement(Toast, { variant, title, description, duration, buttons, promise }))

        const removeToast = () => {
            ROOT.unmount();
            TOAST_ELEMENT.remove();
        };

        if (promise) promise.promise.finally(() => setTimeout(removeToast, duration));
        else setTimeout(removeToast, duration);

        setTimeout(() => {
            TOAST_CONTAINER.scrollTop = TOAST_CONTAINER.scrollHeight;    
        }, 50)
    }, [])

    useEffect(() => {
        CREATE_TOAST_REF.current = createToastFunc;
    }, [createToastFunc]);

    return (
        <TOAST_CONTEXT.Provider value={{ createToastFunc }}>
            {children}
        </TOAST_CONTEXT.Provider>
    );
}

export const useToast = () => {
    const context = use(TOAST_CONTEXT);
    if (!context) throw new Error("useToast needs to be used within a ToastProvider")
    return context;
}

export const createToast = (options: TOAST_PROPS) => {
    if (typeof window !== "undefined" && CREATE_TOAST_REF.current) {
        CREATE_TOAST_REF.current(options);
    }
};