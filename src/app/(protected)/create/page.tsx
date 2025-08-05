import Typography from "@/components/misc/typography";
import PageHeading from "@/components/navigation/pageHeading";
import { ChatBubbleBottomCenterTextIcon, ViewColumnsIcon } from "@heroicons/react/16/solid";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
 
export const metadata: Metadata = {
  title: "Create",
};

export default async function CreatePage() {

    const t = await getTranslations("/create");
    
    return (
        <div>
            <PageHeading title={t("Heading")} />
            <main className="pageMain flex flex-col gap-4">
                <Link href={"/create/post"} className="flex flex-row sm:flex-row w-full items-center gap-5 relative group transition-all bg-foreground hover:bg-BtnSecondary_Hover hover:bg-card active:bg-card hover:cursor-pointer border-0 border-border group-hover/title:!border-white h-fit rounded-sm p-6">
                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 !text-white" />
                    <div className="flex flex-col w-full text-left">
                        <Typography variant="h5">{t("Post")}</Typography>
                        <Typography variant="p" className="!text-secondary">{t("PostSubtitle")}</Typography>
                    </div>
                </Link>
                <Link href={"/create/community"} className="flex flex-row sm:flex-row w-full items-center gap-5 relative group transition-all bg-foreground hover:bg-BtnSecondary_Hover hover:bg-card active:bg-card hover:cursor-pointer border-0 border-border group-hover/title:!border-white h-fit rounded-sm p-6">
                    <ViewColumnsIcon className="w-8 h-8 !text-white" />
                    <div className="flex flex-col w-full text-left">
                        <Typography variant="h5">{t("Community")}</Typography>
                        <Typography variant="p" className="!text-secondary">{t("CommunitySubtitle")}</Typography>
                    </div>
                </Link>
            </main>
        </div>
    );
}