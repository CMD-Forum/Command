"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { createPost, getCommunityByName } from "@/lib/data";

import { authClient } from "@/lib/auth/auth-client";
import { legacy_logError } from "@/lib/utils";
import { CloudArrowUpIcon } from "@heroicons/react/16/solid";
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
    file: z
        .any(),
    imageurl:
        z.string(),
    imagealt: z
        .string()
})

export default function CreateImagePostForm() {

    const t = useTranslations("/create./post.ImagePostForm");

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>("");

    const FORM = useForm<z.infer<typeof FORM_SCHEMA>>({
        resolver: zodResolver(FORM_SCHEMA),
        defaultValues: {
            community: "",
            title: "",
            file: undefined,
            imageurl: "",
            imagealt: "",
        },
    });

    const handleFileUpload = async (file: File): Promise<string | null> => {
        try {
            const FORMDATA = new FormData();
            FORMDATA.append("file", file);
        
            const RES = await fetch("/api/v2/image/upload", {
                method: "POST",
                body: FORMDATA,
            });
        
            if (!RES.ok) throw new Error("Image failed to upload.");
        
            const { url: URL } = await RES.json();
            return URL;
        } catch (error) {
            legacy_logError(error);
            createToast({
                variant: "Error",
                title: t("Error.UploadFail.Title"),
                description: t("Error.UploadFail.Description"),
            });
            return null;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        if (selectedFile) {
            const READER = new FileReader();
            const IMAGE_ELEMENT = document.getElementById("ImagePreview") as HTMLImageElement;
            if (IMAGE_ELEMENT) {
                IMAGE_ELEMENT.title = selectedFile.name;

                READER.onload = function(event) {
                    IMAGE_ELEMENT.src = event.target?.result as string;
                };

                READER.readAsDataURL(selectedFile);
            }
        }
    }, [selectedFile]);

    const { data: SESSION } = authClient.useSession();
    const ROUTER = useRouter();

    if (!SESSION?.user?.id) {
        createToast({ variant: "Error", title: t("Error.AuthFail.Title"), description: t("Error.AuthFail.Description") });
        ROUTER.push("/login");
        return <></>
    }

    const OnSubmit = async (values: z.infer<typeof FORM_SCHEMA>) => {
        try {
            setIsLoading(true);

            let IMAGE_URL: string | null = "";
            if (selectedFile) {
                IMAGE_URL = await handleFileUpload(selectedFile);
                if (!IMAGE_URL || IMAGE_URL.trim() === "" || IMAGE_URL === undefined) {
                    setIsLoading(false);
                    createToast({ variant: "Error", title: t("Error.Generic.Title"), description: t("Error.Generic.Description") });
                }
            } else {
                setIsLoading(false);
                setImageError(t("Error.NoImage.Description"))
                return null;
            }
        
            const POST_COMMUNITY = await getCommunityByName(values.community);
        
            if (POST_COMMUNITY) {
                const POST_DATA = {
                    title: values.title,
                    communityId: POST_COMMUNITY.id,
                    content: "",
                    imageurl: IMAGE_URL,
                    imagealt: values.imagealt,
                    authorId: SESSION.user.id,
                };
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
        } catch {
            createToast({ variant: "Error", title: t("Error.Generic.Title"), description: t("Error.Generic.Description") });
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
                <TextInput error={FORM.formState.errors.community ? true : false} {...FORM.register("title")} />
            </div>

            {FORM.formState.errors.title?.message && ( <ErrorMessage message={FORM.formState.errors.title.message} /> )}

            {/* */}

            <label htmlFor="image-input" className={`flex rounded-sm border border-dashed border-border ${imageError && "border-red-300"} w-full h-fit p-12 hover:border-border-light focus:border-border-light transition-all items-center justify-center`}>
                <div className="flex flex-col w-fit h-fit items-center justify-center">
                    { selectedFile ? <img id="ImagePreview" className="w-full h-full rounded-sm" alt="" /> : <CloudArrowUpIcon className="w-10 h-10" /> }
                    <Typography variant="p" className={selectedFile ? "mt-4" : ""} centered>{selectedFile ? selectedFile.name : t("UploadText")}</Typography>
                </div>
            </label>
            <input id="image-input" type="file" accept="image/*" onChange={handleFileChange} className="!hidden" />
            {imageError && <ErrorMessage message={imageError} />}

            {FORM.formState.errors.imageurl?.message && ( <ErrorMessage message={FORM.formState.errors.imageurl.message} /> )}

            <Button variant="Primary" submitBtn={true} className="!w-full sm:!w-fit justify-center min-w-[62px]" loading={isLoading}>{t("Create")}</Button>
        </form>
    );
}