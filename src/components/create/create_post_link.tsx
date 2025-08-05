// TO-DO: Redo this entire component in line with new version

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { createPost, getCommunityByName } from "@/lib/data";

import { authClient } from "@/lib/auth/auth-client";
import { legacy_logError } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Button from "../button/button";
import TextInput from "../input/text_input";
import ErrorMessage from "../misc/errorMessage";
import Typography from "../misc/typography";
import { createToast } from "../toast/toast";

const FORM_SCHEMA = z.object({
    title: z
        .string()
        .min(5, "Title must have at least 5 characters.")
        .max(75, "Title must be under 75 characters."),
    community: z
        .string()
        .min(2, "All communitys are 2 characters or over.")
        .max(20, "All communitys have a maximum of 20 characters."),
    href: z
        .string()
        .url("Image must be a URL and start with `https://`"),
})

export default function CreateLinkPostForm() {

    const t = useTranslations("/create./post.LinkPostForm");

    const [isLoading, setIsLoading] = useState(false);

    const FORM = useForm<z.infer<typeof FORM_SCHEMA>>({
        resolver: zodResolver(FORM_SCHEMA),
        defaultValues: {
            community: "",
            title: "",
            href: "",
        },
    });

    const { data: SESSION } = authClient.useSession();
    const ROUTER = useRouter();

    if (!SESSION?.user?.id) {
        createToast({ variant: "Error", title: t("Error.AuthFail.Title"), description: t("Error.AuthFail.Description") });
        ROUTER.push("/login");
        return <></>
    }

    const OnSubmit = async (values: z.infer<typeof FORM_SCHEMA>) => {
        setIsLoading(true);
    
        const POST_COMMUNITY = await getCommunityByName(values.community)
    
        if (POST_COMMUNITY) {
            const POST_DATA = {
                title: values.title,
                communityId: POST_COMMUNITY.id,
                content: "",
                href: values.href,    
                authorId: SESSION.user?.id,
            }
            try {
                const POST = await createPost(POST_DATA); 
                setIsLoading(false); 
                createToast({ variant: "Success", title: t("SuccessToast.Title"), description: t("SuccessToast.Description") });
                ROUTER.push(`/posts/${POST.id}`);
            } catch (error) {
                legacy_logError(error, false, "/components/create/create_post.tsx")
                createToast({ variant: "Error", title: t("Error.Generic.Title"), description: t("Error.Generic.Description") });
                setIsLoading(false);
            }
        } else {
            createToast({ variant: "Error", title: t("Error.CommunityDoesNotExist.Title"), description: t("Error.CommunityDoesNotExist.Description") });
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-4 bg-foreground p-6 rounded-sm !w-full bg-grey-one" onSubmit={FORM.handleSubmit(OnSubmit)}>

            <div className="flex flex-col gap-1">
                <Typography variant="p">{t("Community")}</Typography>
                <TextInput error={FORM.formState.errors.community ? true : false} {...FORM.register("community")} />
            </div>

            {FORM.formState.errors.community?.message && ( <ErrorMessage message={FORM.formState.errors.community.message} /> )}

            {/* */}

            <div className="flex flex-col gap-1">
                <Typography variant="p">{t("Title")}</Typography>
                <TextInput error={FORM.formState.errors.title ? true : false} {...FORM.register("title")} />
            </div>

            {FORM.formState.errors.title?.message && ( <ErrorMessage message={FORM.formState.errors.title.message} /> )}

            {/* */}

            <div className="flex flex-col gap-1">
                <Typography variant="p">{t("Link")}</Typography>
                <TextInput error={FORM.formState.errors.href ? true : false} {...FORM.register("href")} />
            </div>

            {FORM.formState.errors.href?.message && ( <ErrorMessage message={FORM.formState.errors.href.message} /> )}

            {/* */}

            <Button variant="Primary" submitBtn={true} className="!w-full sm:!w-fit justify-center min-w-[62px]" loading={isLoading}>{t("Create")}</Button>
        </form>
    );
}