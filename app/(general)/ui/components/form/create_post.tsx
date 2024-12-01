"use client";

import { zodResolver } from "@hookform/resolvers/zod" // Form Validation
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaMarkdown } from "react-icons/fa6";

const Markdown = dynamic(
    () => import("react-markdown"), 
    { loading: () => 
        <div className="flex flex-col gap-2">
            <div className="w-92 h-10 rounded bg-border animate-pulse" />
            <div className="w-52 h-6 rounded bg-border animate-pulse" />
            <div className="w-64 h-6 rounded bg-border animate-pulse" />
            <div className="w-64 h-6 rounded bg-border animate-pulse" />
            <div className="w-64 h-6 rounded bg-border animate-pulse" />
        </div>
    }
);

import dynamic from "next/dynamic";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import * as z from "zod";

import { createPost, getCommunityByName } from "@/app/(general)/lib/data";
import { useSession } from "@/app/(general)/lib/sessioncontext";

import Alert, { AlertSubtitle, AlertTitle } from "../new_alert";

const FormSchema = z.object({
    title: z
        .string()
        .min(5, "Title must have at least 5 characters.")
        .max(75, "Title must be under 75 characters."),
    community: z
        .string()
        .min(2, "All communitys are 2 characters or over.")
        .max(20, "All communitys have a maximum of 20 characters."),
    content: z
        .string()
        .min(50, "Content must be at least 50 characters")
        .max(99999, "Posts cannot exceed 99,999 characters long. Split the post if required.")
});

function ErrorMessage(props: { message: string }) {
    return <p className="text-red-300 text-sm">{props.message}</p>;
}

export default function CreatePostForm() {

    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<false | true | null>(null);
    const [com_err, setCom_Err] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [markdown, setMarkdown] = useState<string>();
    const [markdownPreview, setMarkdownPreview] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        community: '',
        title: '',
        content: ''
      },
    });

    const session = useSession();
    const router = useRouter();

    if ( ! session ) {
        return (
            <Alert type={"error"} closeBtn={false}>
                <AlertTitle>It looks like you&apos;re not logged in, please login.</AlertTitle>
            </Alert>
        );
    }

    const OnSubmit = async (values: z.infer<typeof FormSchema>) => {

      setIsLoading(true);
      setCom_Err("");
      setSuccess(false);
  
      const post_community = await getCommunityByName(values.community);
  
      if (post_community) {
  
        const postData = {
          title: values.title,
          communityId: post_community.id,
          content: markdown,
          imageurl: null,
          imagealt: null,
          authorId: session.user?.id,
        };
        
        try {
            // @ts-ignore
            const post = await createPost(postData); 
            setIsLoading(false); 
            setSuccess(true);
            router.push(`/posts/${post.id}`);
        } catch ( error ) {
            // @ts-ignore
            setCom_Err("Sorry, something went wrong.");
            setIsLoading(false);
        }

      } else {
        setCom_Err("That community doesn't exist. Make sure you spelled it correctly.");           
        setIsLoading(false);
      }
    };
  
    return (

        <form className="flex flex-col gap-2 bg-transparent rounded-lg-lg !w-full" onSubmit={form.handleSubmit(OnSubmit)}>

            {com_err && (
                <Alert type="error">
                    <AlertTitle>{com_err}</AlertTitle>
                </Alert>
            )}

            {success && (
                <Alert type="success">
                    <AlertTitle>Your post was successfully created.</AlertTitle>
                </Alert>
            )}

            {error && (
                <Alert type="error">
                    <AlertTitle>Sorry, something went wrong.</AlertTitle>
                    <AlertSubtitle>Please try again later.</AlertSubtitle>
                </Alert>
            )}

            <div className="flex gap-0.5 subtitle required">Community</div>
            <input
                {...form.register('community')}
                placeholder="general"
                className={`generic_field ${form.formState.errors.community ? "error" : ""}`}
            />

            {form.formState.errors.community && (
                // @ts-expect-error
                <ErrorMessage message={form.formState.errors.community.message} />
            )}

            {/* */}

            <div className="flex gap-0.5 subtitle required">Title</div>
            <input
                {...form.register('title')}
                placeholder="Look at my amazing code!"
                className={`generic_field ${form.formState.errors.title ? "error" : ""}`}
            />

            {form.formState.errors.title && (
                // @ts-ignore
                <ErrorMessage message={form.formState.errors.title.message} />
            )}

            {/* */}

            <div className="flex gap-0.5 subtitle required">
                Content
                <Link href={"https://github.github.com/gfm/"}><FaMarkdown className="h-5 w-5 text-gray-300 hover:text-white transition-all ml-1 mr-1" /></Link>
            </div>

            <textarea 
                className={`h-fit max-h-96 min-h-16 py-1 ${form.formState.errors.content ? "error" : ""}`} 
                {...form.register('content')} 
                onChange={(e) => setMarkdown(e.target.value)} 
                placeholder="Write your post here..."
            />

            {form.formState.errors.content && (
                // @ts-ignore
                <ErrorMessage message={form.formState.errors.content.message} />
            )}

            <div className="flex gap-2 items-center">
                <input type="checkbox" name="enablePreview" id="enablePreview" checked={markdownPreview} onChange={() => setMarkdownPreview(!markdownPreview)} />
                <label htmlFor="enablePreview" className="subtitle">Preview</label>                
            </div>
            
            { markdownPreview 
            ?
                markdown 
                ?
                    <div className='markdown-body'>
                        <Markdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
                    </div>
                :
                    <p>Start typing to see a preview.</p>
            :
            null
            }

            {/* */}

            <button type="submit" className="navlink-full !w-full sm:!w-fit justify-center min-w-[62px]">
                {isLoading ? <img src="/spinner.svg" alt="Submitting..." className="spinner"/>  : null }
                Submit
            </button>

        </form>

    );

}