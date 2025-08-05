"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";

import { useCommunity } from "@/lib/context/community";
import { createPost, getCommunityByName } from "@/lib/data";
import { log } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth/auth-client";
import { CommunityCombobox } from "../community/communityCombobox";
import RichMarkdownEditor from "../markdown/rich-editor";
import ErrorMessage from "../misc/errorMessage";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

const FORM_SCHEMA = z.object({
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
        .min(50, "Content must be at least 50 characters.")
        .max(99999, "Posts cannot exceed 99,999 characters long. Split the post if required.")
});

export default function CreatePostForm() {

    const t = useTranslations("/create./post.PostForm");

    const [isLoading, setIsLoading] = useState(false);
    /*const [markdown, setMarkdown] = useState<string>("");
    const [markdownPreview, setMarkdownPreview] = useState<boolean>(false);*/

    const { setCommunity, setError } = useCommunity();

    const FORM = useForm<z.infer<typeof FORM_SCHEMA>>({
        resolver: zodResolver(FORM_SCHEMA),
        defaultValues: {
            community: "",
            title: "",
            content: ""
        },
    });

    const { data: SESSION } = authClient.useSession();
    const ROUTER = useRouter();
    const COMMUNITY_NAME = FORM.watch("community");
    // const token = localStorage.getItem("bearer_token");

    useEffect(() => {
        fetch(`/api/community/getSingle/byName/${COMMUNITY_NAME}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}`,
            }
        }).then(async (res) => { 
            if (!res.ok) setError(true);
            else setCommunity(await res.json());
        })
    }, [FORM, SESSION?.session?.id, setCommunity, setError, COMMUNITY_NAME]);

    const OnSubmit = async (values: z.infer<typeof FORM_SCHEMA>) => {
        setIsLoading(true);
    
        const POST_COMMUNITY = await getCommunityByName(values.community);
    
        if (POST_COMMUNITY) {
            const POST_DATA = {
                title: values.title,
                communityId: POST_COMMUNITY.id,
                content: values.content,
                imageurl: null,
                imagealt: null,
                authorId: SESSION?.user?.id,
            };
            
            try {
                if (POST_DATA.authorId === undefined) throw new Error("No authorId!");
                // @ts-expect-error: Type mismatch since TS thinks authorId and thus session is possibly undefined, 
                // but the page cannot be accessed without being logged in and an error is thrown above and should be caught if it's somehow missing.
                const POST = await createPost(POST_DATA);
                setIsLoading(false); 
                toast.success(t("SuccessToast.Title"), { description: t("SuccessToast.Description") });
                ROUTER.push(`/posts/${POST.id}`);
            } catch (error) {
                log({ message: error, type: "error", scope: "/components/create/create_post.tsx" })
                toast.error(t("Error.Generic.Title"), { description: t("Error.Generic.Description") });
                setIsLoading(false);
            }
        } else {
            toast.error(t("Error.CommunityDoesNotExist.Title"), { description: t("Error.CommunityDoesNotExist.Description") });
            setIsLoading(false);
        }
    };
  
    return (
        <Card className="!h-fit">
            <Form {...FORM}>
                <form className="px-6 w-full space-y-4" onSubmit={FORM.handleSubmit(OnSubmit)}>
                    <FormField
                        control={FORM.control}
                        name="community"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("Community")}</FormLabel>
                                <div className="flex">
                                    <p className="w-fit text-sm text-muted-foreground h-[36px] px-3 flex items-center border border-input border-r-0 rounded-sm rounded-r-none bg-input">c/</p>
                                    <FormControl className="w-full">
                                        <CommunityCombobox form={FORM} formFieldName="community" {...field} />
                                    </FormControl>                                        
                                </div>
                                <FormDescription>
                                    {t("CommunityDescription")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={FORM.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("Title")}</FormLabel>
                                <FormControl className="w-full">
                                    <Input className="w-full" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormLabel className={FORM.formState.errors.content ? "text-destructive" : ""}>{t("Content")}</FormLabel>

                    <div>
                        <RichMarkdownEditor form={FORM} formFieldName="content" />
                                                
                        <FormDescription className="mt-2">
                            {t("ContentDescription")} 
                        </FormDescription>
                        <ErrorMessage message={FORM.formState.errors.content?.message} className="text-destructive text-sm mt-2" />
                    </div>

                    <Button variant="default" type={"submit"} loading={isLoading}>{t("Create")}</Button>
                </form>
            </Form>
        </Card>
    );
}