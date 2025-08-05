/* eslint-disable sort-imports */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

import CommunitySidebar from "@/components/community/communitySidebar";
import PageHeading from "@/components/navigation/pageHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreatePostForm = dynamic(() => import("@/components/create/create_post"), { loading: () => <div className="h-80 bg-border animate-pulse rounded-sm" />});
const CreateImagePostForm = dynamic(() => import("@/components/create/create_post_image"), { loading: () => <div className="h-80 bg-border animate-pulse rounded-sm" />});
const CreateLinkPostForm = dynamic(() => import("@/components/create/create_post_link"), { loading: () => <div className="h-80 bg-border animate-pulse rounded-sm" />});
 
export const metadata: Metadata = {
    title: "Create Post",
};

export default async function CreatePostPage() {
    
    const t = await getTranslations("/create./post");

    return (
        <>
            <PageHeading title={t("Heading")} />
            <main className="flex flex-row gap-6 w-full">
                <Tabs defaultValue="text" className="w-full !h-fit mt-4">
                    <TabsList className="w-full">
                        <TabsTrigger value="text">{t("Text")}</TabsTrigger>
                        <TabsTrigger value="image">{t("Image")}</TabsTrigger>
                        <TabsTrigger value="link">{t("Link")}</TabsTrigger>
                    </TabsList>
                    <div className="mb-1" />
                    <TabsContent value="text"><CreatePostForm /></TabsContent>
                    <TabsContent value="image"><CreateImagePostForm /></TabsContent>
                    <TabsContent value="link"><CreateLinkPostForm /></TabsContent>
                </Tabs>
                <div className="mt-18">
                    <CommunitySidebar />    
                </div>
            </main>        
        </>
    );
}