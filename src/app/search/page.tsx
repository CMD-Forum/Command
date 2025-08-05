import { getTranslations } from "next-intl/server";

import PageHeading from "@/components/navigation/pageHeading";
import SearchForm from "@/components/search/searchform";

export default async function Search() {

    const t = await getTranslations("/search");

    return (
        <div>
            <PageHeading title={t("Heading")} />
            <SearchForm />
        </div>
    );
}