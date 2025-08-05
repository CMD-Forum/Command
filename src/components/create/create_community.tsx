/*
TO-DO: Move isLoading and other logic to mutation.isPending, mutation.isError and mutation.isSuccess
    -> To do that, image processing has to be moved to server side and incorporated into mutation.
    -> Took long enough to get basic mutation working, this will be done anothee time. Shouldn't be too much impact, anyway.
*/

"use client";

import { authClient } from "@/lib/auth/auth-client";
import { createCommunity } from "@/lib/data/community/community-data";
import { log } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod"; // Form Validation
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import CommunitySidebar from "../community/communitySidebar";
import RichMarkdownEditor from "../markdown/rich-editor";
import ErrorMessage from "../misc/errorMessage";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CreateCommunityForm() {

    const t = useTranslations("/create./post.CommunityForm");

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string>("");

    const CREATE_COMMUNITY_SCHEMA = z.object({
        name: z
            .string()
            .min(2, t("Error.Validation.Name.Min"))
            .max(20, t("Error.Validation.Name.Max"))
            .transform(value => value.replace(/\s+/g, "")),
        short_description: z
            .string()
            .min(5, t("Error.Validation.Description.Min"))
            .max(500, t("Error.Validation.Description.Max")),
        sidebar_content: z
            .string()
            .min(15, t("Error.Validation.Sidebar.Min"))
            .max(50000, t("Error.Validation.Sidebar.Max")),
        image_url: z
            .string(),
        file: z
            .any(),
    })

    const FORM = useForm<z.infer<typeof CREATE_COMMUNITY_SCHEMA>>({
        resolver: zodResolver(CREATE_COMMUNITY_SCHEMA),
        defaultValues: {
            name: "",
            short_description: "",
            sidebar_content: "",
            image_url: "",
            file: undefined,
        },
    });

    const handleFileUpload = async (file: File): Promise<string | null> => {
        try {
            const FORMDATA = new FormData();
            FORMDATA.append("file", file);
            
            const RES = await fetch("/api/v2/image/upload", {
                method: "POST",
                body: FORMDATA
            });
            
            if (!RES.ok) {
                toast.error(t("Error.UploadFail.Title"))
                throw new Error("Image failed to upload.");
            }
            
            const { url: URL } = await RES.json();
            return URL;
        } catch (error) {
            log({ type: "error", message: error });
            toast.error(t("Error.UploadFail.Title"), {
                description: t("Error.UploadFail.Description"),
            });
            return null;
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setImageError("");
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

    const [sidebarData, setSidebarData] = useState({
        name: "",
        description: "",
        sidebar_content: "",
        image: "TextPostFallback.png",
        createdAt: new Date(),
    });

    useEffect(() => {
        const SUBSCRIPTION = FORM.watch((values) => {
            setSidebarData({
                name: ("c/" + values.name).replace(/\s+/g, "") || "",
                description: values.short_description || "",
                sidebar_content: values.sidebar_content || "",
                image: values.image_url || "TextPostFallback.png",
                createdAt: new Date(),
            });
        });
        return () => SUBSCRIPTION.unsubscribe();
    }, [FORM]);

    const queryClient = useQueryClient();

    queryClient.setMutationDefaults(["createCommunity"], {
        mutationFn: createCommunity,
        onSuccess: (result) => {
            if (result.response) {
                toast.success("Community created!");
                ROUTER.push(`/c/${result.response.community.name}`);
            } else {
                switch(result.status) {
                    case 400:
                        toast.error(t("Error.ValidationError.Title"), { description: t("Error.ValidationError.Description") });
                        break;
                    case 401:
                        toast.error(t("Error.AuthFail.Title"), { description: t("Error.AuthFail.Description") });
                        break;
                    case 409:
                        toast.error(t("Error.NameTaken.Title"), { description: t("Error.NameTaken.Description") });
                        break;
                    case 500:
                        toast.error(t("Error.Generic.Title"), { description: t("Error.Generic.Description") });
                        break;
                    default:
                        toast.error(t("Error.Generic.Title"), { description: t("Error.Generic.Description") });
                        break;
                }
            }
        },
        onError: () => {
            toast.error(t("Error.Generic.Title"), { description: t("Error.Generic.Description") });
        }
    })

    const mutation = useMutation({ mutationKey: ["createCommunity"], mutationFn: createCommunity });

    const OnSubmit = async (values: z.infer<typeof CREATE_COMMUNITY_SCHEMA>) => {
        setIsLoading(true);

        try {
            let IMAGE_URL: string | null = "";
            if (selectedFile) {
                IMAGE_URL = await handleFileUpload(selectedFile);
                if (!IMAGE_URL || IMAGE_URL.trim() === "" || IMAGE_URL === undefined) {
                    setIsLoading(false);
                    toast.error(t("Error.Generic.Title"), { description: t("Error.Generic.Description") });
                    return;
                }
            } else {
                setIsLoading(false);
                setImageError(t("Error.NoImage.Description"))
                return null;
            }

            const COMMUNITY_DATA = {
                name: values.name,
                description: values.short_description,
                sidebar_content: values.sidebar_content,
                image_url: IMAGE_URL
            };
        
            await mutation.mutate(COMMUNITY_DATA);
        } catch (error) {
            log({ type: "error", message: error });
            setIsLoading(false);
            toast.error(t("Error.Generic.Title"), { description: t("Error.Generic.Description") });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card className="w-full !h-fit">
                <Form {...FORM}>
                    <form className="px-6 w-full space-y-4" onSubmit={FORM.handleSubmit(OnSubmit)}>
                        <FormField
                            control={FORM.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{t("Name")}</FormLabel>
                                    <div className="flex">
                                        <p className="w-fit text-sm text-muted-foreground h-[36px] px-3 flex items-center border border-input border-r-0 rounded-sm rounded-r-none bg-input">c/</p>
                                        <FormControl className="w-full">
                                            <Input className="w-full !rounded-l-none" {...field} />
                                        </FormControl>                                        
                                    </div>
                                    <FormDescription>
                                        {t("NameDescription")}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={FORM.control}
                            name="short_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("Description")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t("ShortDescription_Description")} 
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormLabel className={FORM.formState.errors.sidebar_content ? "text-destructive" : ""}>{t("SidebarContent")}</FormLabel>

                        <div>
                            <RichMarkdownEditor form={FORM} formFieldName="sidebar_content" />
                            
                            <FormDescription className="mt-2">
                                {t("SidebarContentDescription")} 
                            </FormDescription>
                            <ErrorMessage message={FORM.formState.errors.sidebar_content?.message} className="text-destructive text-sm mt-2" />
                        </div>

                        <FormLabel className={FORM.formState.errors.image_url ? "text-destructive" : ""}>{t("Logo")}</FormLabel>

                        <label htmlFor="image-input" className={`flex rounded-sm border hover:bg-input/15 border-dashed border-input ${imageError && "border-red-300"} w-full h-fit p-12 hover:border-border-light focus:border-border-light transition-all items-center justify-center`}>
                            <div className="flex flex-col w-fit h-fit items-center justify-center">
                                { selectedFile ? <img id="ImagePreview" className="w-full h-full rounded-sm" alt="" /> : <Upload /> }
                                <Label className={`text-center w-full text-muted-foreground mt-2 ${selectedFile ? "mt-4" : ""}`}>{selectedFile ? selectedFile.name : t("UploadText")}</Label>
                            </div>
                        </label>
                        <input id="image-input" type="file" accept="image/*" onChange={handleFileChange} className="!hidden" />
                        {imageError && <ErrorMessage message={imageError} />}

                        {FORM.formState.errors.image_url?.message && ( <ErrorMessage message={FORM.formState.errors.image_url.message} /> )}

                        <Button variant="default" type="submit" className="!w-full sm:!w-fit justify-center" loading={isLoading} size={isLoading ? "icon" : "default"}>{t("Create")}</Button>
                    </form>
                </Form>
            </Card>
            <CommunitySidebar 
                community={sidebarData} 
                members={1}
                posts={0}
                information={{
                    about: sidebarData.sidebar_content,
                    rules: [{ id: "0", createdAt: new Date(), updatedAt: new Date(), communityID: "0", title: "No Rules Yet", description: "Make this community to add rules." }],
                    moderators: [{ username: SESSION?.user?.username || "", image: SESSION?.user?.image || "/TextPostFallback.png" }],
                    related_communities: [{ name: t("Sidebar.Information.RelatedCommunities.Title"), description: t("Sidebar.Information.RelatedCommunities.Description"), image: "/TextPostFallback.png" }]
                }}
            />
        </>
    );
}