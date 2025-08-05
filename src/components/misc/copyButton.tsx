import { log } from "@/lib/utils";
import React from "react";

export default async function CopyButton({ trigger, inputRef }: { trigger: React.ReactElement, inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null | undefined> | undefined }) {
    return (
        React.cloneElement(trigger as React.ReactElement<Partial<{ onClick: () => void }>>, {
            onClick: async () => {
                try {
                    if (inputRef?.current?.value) await navigator.clipboard.writeText(inputRef.current.value || "");
                    else log({ type: "warning", message: "Clipboard API not supported or input is empty." });
                } catch (error) {
                    log({ type: "warning", message: ("Failed to copy using Clipboard API. Falling back to execCommand." + error) });
                    if (inputRef?.current) {
                        inputRef.current.focus();
                        inputRef.current.select();
                        document.execCommand("copy");
                    }
                }
            }
            }
        )
    );
}