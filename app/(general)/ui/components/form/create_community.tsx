"use client";

import { zodResolver } from "@hookform/resolvers/zod" // Form Validation
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createCommunity, createUserMembershipRecord, getCommunityByName } from "@/app/(general)/lib/data";
import { CreateCommunitySchema } from "@/app/(general)/lib/schemas";
import { useSession } from "@/app/(general)/lib/sessioncontext";

import Alert, { AlertTitle } from "../new_alert";

function ErrorMessage(props: { message: string }) {
    return <p className="text-red-300 text-sm">{props.message}</p>;
}

export default function CreateCommunityForm() {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof CreateCommunitySchema>>({
      resolver: zodResolver(CreateCommunitySchema),
      defaultValues: {
        name: '',
        short_description: '',
        sidebar_description: '',
        image_url: '',
      },
    });

    const session = useSession();

    if ( ! session ) {
        return (
            <Alert type={"error"} closeBtn={false}>
                <AlertTitle>It looks like you&apos;re not logged in, please login.</AlertTitle>
            </Alert>
        );
    }

    const OnSubmit = async (values: z.infer<typeof CreateCommunitySchema>) => {

      setIsLoading(true);
      setError(null);
      setSuccess(false);
  
      const existingCommunity = await getCommunityByName(values.name);
  
      if ( ! existingCommunity && session.user?.id ) {
  
        const communityData = {
            name: values.name,
            description: values.short_description,
            sidebar_md: values.sidebar_description,
            image: values.image_url,
            creatorUserID: session.user.id
        };
        
        try {
            const community = await createCommunity(communityData); 
            await createUserMembershipRecord({ userID: session.user.id, communityID: community.id });    
            setIsLoading(false); 
            setSuccess(true);
        } catch ( error ) {
            setIsLoading(false);
            setError("Something went wrong, please try again later.");
        }
      } else {
        setIsLoading(false);
        setError("Sorry, that name has been taken.");
      }
    };
  
    return (
        <form className="flex flex-col gap-2 bg-transparent rounded-lg-lg !w-full" onSubmit={form.handleSubmit(OnSubmit)}>

            {success && (
                <Alert type="success">
                    <AlertTitle>Community was successfully created.</AlertTitle>
                </Alert>
            )}

            {error && (
                // @ts-ignore
                <Alert type="error">
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}

            <p className="flex gap-0.5 required">Name</p>
            <input
                {...form.register('name')}
                placeholder="general"
                className={`generic_field ${form.formState.errors.name ? "error" : ""}`}
            />

            {form.formState.errors.name && (
                // @ts-expect-error
                <ErrorMessage message={form.formState.errors.name.message} />
            )}

            {/* */}

            <p className="flex gap-0.5 subtitle required">Description</p>
            <input
                {...form.register('short_description')}
                placeholder="Welcome to my community!"
                className={`generic_field ${form.formState.errors.short_description ? "error" : ""}`}
            />

            {form.formState.errors.short_description && (
                // @ts-expect-error
                <ErrorMessage message={form.formState.errors.short_description.message} />
            )}

            {/* */}

            <p className="flex gap-0.5 subtitle required">Sidebar Content</p>
            <textarea
                {...form.register('sidebar_description')}
                className={`h-fit max-h-96 min-h-16 py-1 ${form.formState.errors.sidebar_description ? "error" : ""}`}
            />

            {form.formState.errors.sidebar_description && (
                // @ts-expect-error
                <ErrorMessage message={form.formState.errors.sidebar_description.message} />
            )}

            {/* */}

            <p className="flex gap-0.5 subtitle required">Image</p>
            <input
                {...form.register('image_url')}
                placeholder="https://domainimagesaretemporary.org/images/070524"
                className={`generic_field ${form.formState.errors.image_url ? "error" : ""}`}
            />

            {form.formState.errors.image_url && (
                // @ts-ignore
                <ErrorMessage message={form.formState.errors.image_url.message} />
            )}

            <button type="submit" className="navlink-full !w-full sm:!w-fit justify-center min-w-[62px]">
                {isLoading && <img src="/spinner_black.svg" alt="Submitting..." className="spinner"/> } 
                Create Community 
            </button>
        </form>
    );
}