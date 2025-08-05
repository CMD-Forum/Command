import { log } from "@/lib/utils";
import React from "react";

export default async function PasteButton({ trigger, inputRef }: { trigger: React.ReactElement, inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null | undefined> | undefined }) {
    return (
        React.cloneElement(trigger as React.ReactElement<Partial<{ onClick: () => void }>>, {
            onClick: async () => {
                try {
                    const TEXT = await navigator.clipboard.readText();
                    if (inputRef?.current) inputRef.current.value = TEXT;
                    else log({ type: "warning", message: "Clipboard API not supported or input is empty." });
                } catch (error) {
                    log({ type: "warning", message: ("Failed to copy using Clipboard API. Falling back to execCommand." + error) });
                    if (inputRef?.current) {
                        inputRef.current.focus();
                        inputRef.current.select();
                        document.execCommand("paste");
                    }
                }
            }
            }
        )
    );
}