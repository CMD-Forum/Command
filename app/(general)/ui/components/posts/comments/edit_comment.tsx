"use client";

import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { editComment } from "@/app/(general)/lib/data";
import { logError } from "@/app/(general)/lib/utils";

import Alert, { AlertTitle } from "../../new_alert";

const CommentSchema = z.object({
    content: z
        .string()
        .min(1, "Comment must not be empty.")
        .max(10000, "Comments cannot exceed 10,000 characters long. Split the comment if required.")
});

function ErrorMessage(props: { message: string }) {
    return <p className="text-red-300 text-sm">{props.message}</p>;
}

export default function EditComment({ commentID }: { commentID: string }) {

    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof CommentSchema>>({
        resolver: zodResolver(CommentSchema),
        defaultValues: {
          content: ''
        },
    });

    const OnSubmit = async (values: z.infer<typeof CommentSchema>) => {
        setLoading(true);
        setError("");
        setSuccess(false);

        if ( values.content ) {
            try {
                await editComment({ commentID: commentID, content: values.content });
                setSuccess(true);
                setLoading(false);
            } catch ( error ) {
                logError(error);
                setError("Something went wrong.")
                setLoading(false);
            }
        } else {
            setError("Comment cannot be blank.");
            setLoading(false);
        }

    }

    return (
        <>
            <button className="navlink small !text-gray-300 hover:!text-white transition-all" onClick={() => setOpen(!open)}><PencilSquareIcon className="w-4 h-4" />Edit</button>
            
            {createPortal(
                <div>
                    { open &&
                        <form className="mt-4 bg-card border-1 border-border p-4 rounded-lg" onSubmit={form.handleSubmit(OnSubmit)}>
                            {error && (
                                <Alert type="error" className="mb-2" closeBtn={false}>
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            {success && (
                                <Alert type="success" className="mb-2" closeBtn={false}>
                                    <AlertTitle>Comment successfully edited. <div className="flex gap-1 items-center">Press<ArrowPathIcon className="w-4 h-4" />Refresh above to see it.</div></AlertTitle>
                                </Alert>
                            )}
                            <p className="mb-2">Edit</p>
                            <textarea 
                                className={`w-full min-h-40 p-3 py-2 ${form.formState.errors.content ? "error" : ""}`}
                                placeholder="What are you thinking?"
                                {...form.register('content')}
                            />

                            {form.formState.errors.content && (
                                // @ts-ignore-error
                                <ErrorMessage message={form.formState.errors.content.message} />
                            )}
                            
                            <div className="flex gap-2 mt-2">
                                <button className="navlink-full" type="submit">
                                    {loading ? <img src="/spinner.svg" alt="Submitting..." className="spinner"/>  : null }
                                    Edit
                                </button>
                            </div>
                        </form>
                    }
                </div>,
                document.getElementById(`reply-submit-box-${commentID}`) || document.body
            )}        
        </>
    );
}