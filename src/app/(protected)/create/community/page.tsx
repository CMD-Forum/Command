import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CreateCommunityForm from "@/components/create/create_community";
import PageHeading from "@/components/navigation/pageHeading";

export const metadata: Metadata = {
  title: "Create Community",
};

export default async function CreateCommunityPage() {

    const t = await getTranslations("/create./community");

    return (
        <>
            <PageHeading title={t("Heading")} />
            <main className="flex flex-row gap-6 mt-4 mb-4">
                <CreateCommunityForm />
            </main>
        </>
    );
}