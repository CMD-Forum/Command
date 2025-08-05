import CommunitySidebar from "@/components/community/communitySidebar";
import PageHeading from "@/components/navigation/pageHeading";
import PostList from "@/components/posts/post_list";
import { getTranslations } from "next-intl/server";

export default async function SavedPostsPage() {
    const t = await getTranslations("/posts./saved");

    return (
        <>
            <title>{t("Heading")}</title>
            <PageHeading title={t("Heading")} />
            <main className="pageMain">
                <div className="flex flex-row gap-6">
                    {/*<UserSidebar />*/}
                    <PostList
                        url="/api/posts/getAllSaved" 
                        method="GET" 
                    />
                    <CommunitySidebar />
                </div>
            </main>
        </>
    );
}
