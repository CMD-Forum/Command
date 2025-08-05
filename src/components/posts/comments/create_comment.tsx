"use client";

import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createComment } from "@/lib/data";
import { legacy_logError } from "@/lib/utils";

import Button from "@/components/button/button";
import TextInput from "@/components/input/text_input";
import ErrorMessage from "@/components/misc/errorMessage";
import { useTranslations } from "next-intl";
import { createToast } from "@/components/toast/toast";

const COMMENT_SCHEMA = z.object({
    content: z
        .string()
        .min(1, "Comment must not be empty.")
        .max(10000, "Comments cannot exceed 10,000 characters long. Split the comment if required.")
});

export default function CreateComment({ 
    postID, 
    userID,
    open,
    setOpen,
}: { 
    postID: string;
    userID: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {

    const t = useTranslations("Components.CreateComment");

    const [showForm, setShowForm] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const FORM = useForm<z.infer<typeof COMMENT_SCHEMA>>({
        resolver: zodResolver(COMMENT_SCHEMA),
        defaultValues: {
          content: "",
        },
    });

    const OnSubmit = async (values: z.infer<typeof COMMENT_SCHEMA>) => {
        setLoading(true);

        if (values.content) {
            try {
                await createComment({ postID: postID, userID: userID, content: values.content });
                createToast({ variant: "Success", title: t("Success.Title") });
                setOpen(false);
                window.location.reload();
                setLoading(false);
            } catch (error) {
                legacy_logError(error);
                createToast({ variant: "Error", title: t("Error.Title"), description: t("Error.Description") });
                setLoading(false);
            }
        } else {
            createToast({ variant: "Warning", title: t("Blank"), description: "" });
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) {
            setShowForm(true);
            setTimeout(() => setIsTransitioning(true), 10);
        } else {
            setIsTransitioning(false);
        }
    }, [open]);

    return (
        <>
            <Button 
                variant="Secondary" 
                className="small" 
                onClick={() => setOpen(!open)} 
                icon={<ChatBubbleLeftEllipsisIcon aria-label={t("SubmitComment")} />}
                hideTextOnMobile
            >
                {t("Comment")}
            </Button>
            
            {showForm && createPortal(
                <div>
                    <form 
                        className={`transition-all duration-200 ease-in-out overflow-hidden ${isTransitioning ? "!max-h-[1000px] py-4" : "!max-h-0 !py-0"}`}
                        onSubmit={FORM.handleSubmit(OnSubmit)}
                        onTransitionEnd={() => { if(!open) { setShowForm(false); } }}
                    >
                        <TextInput
                            label={t("InputLabel")}
                            textArea={true}
                            error={FORM.formState.errors.content ? true : false}
                            minHeight
                            {...FORM.register("content")}
                        />

                        {FORM.formState.errors.content && ( <ErrorMessage message={FORM.formState.errors.content.message} className="mt-2" /> )}
                            
                        <div className="flex gap-2 mt-2">
                            <Button variant="Primary" submitBtn={true} loading={loading}>{t("Submit")}</Button>
                        </div>
                    </form>
                </div>,
                document.getElementById("comment-submit-box") || document.body
            )}        
        </>
    );
}