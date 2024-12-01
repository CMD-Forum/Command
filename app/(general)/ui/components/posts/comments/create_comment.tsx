"use client";

import { ArrowPathIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createComment } from "@/app/(general)/lib/data";
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

export default function CreateComment({ postID, userID }: { postID: string, userID: string }) {

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
                await createComment({ postID: postID, userID: userID, content: values.content });
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
            <button className='navlink !px-2 lg:!px-3' onClick={() => setOpen(!open)}><ChatBubbleLeftEllipsisIcon className="w-5 h-5" aria-label='Submit Comment' /><span className='hidden lg:flex'>Comment</span></button>
            
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
                                    <AlertTitle>Comment successfully submitted. <div className="flex gap-1 items-center">Press<ArrowPathIcon className="w-4 h-4" />Refresh above to see it.</div></AlertTitle>
                                </Alert>
                            )}
                            <p className="mb-2">Comment</p>
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
                                    Submit
                                </button>
                            </div>
                        </form>
                    }
                </div>,
                document.getElementById("comment-submit-box") || document.body
            )}        
        </>
    );
}