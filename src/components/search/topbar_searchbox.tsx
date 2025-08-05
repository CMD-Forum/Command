import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useTranslations } from "next-intl";
import Link from "next/link";
import SearchResult_Community from "./results/topbar/searchresult_community";
import SearchResult_User from "./results/topbar/searchresult_user";

export default function TopbarSearchBox({ input }: { input: string }) {

    const t = useTranslations("Layout.Topbar.Search");

    if (input) {
        return (
            <div className="z-[999999] absolute top-10 w-[500px] border-t-1 border-border bg-BtnSecondary flex flex-col items-center rounded-sm-b-lg pt-3 h-fit shadow-md">
                <p className="text-sm text-left w-full text-secondary font-semibold px-4">{t("Communities")}</p>
                <SearchResult_Community communityName={"TheBestOfCommand"} communityDescription={"View the best Command has to offer, all in the comfort of this community."} communityImage={"https://placehold.co/500x500"} />
                <SearchResult_Community communityName={"General"} communityDescription={"Catch-all community for anything."} communityImage={"https://placehold.co/500x500"} />
                <SearchResult_Community communityName={"Pictures"} communityDescription={"Share your favourite pictures!"} communityImage={"https://placehold.co/500x500"} />
                <p className="text-sm text-left w-full text-secondary font-semibold px-4">{t("Users")}</p>
                <SearchResult_User userName={"JamsterJava"} userDescription={"hello"} userImage={"https://placehold.co/500x500"} />
                <hr className="w-full border-border border-t-1" />
                <Link href={`/search?q=${encodeURIComponent(input)}`} className="w-full transition-all flex items-center gap-4 hover:bg-BtnSecondary_Hover px-4 py-3">
                    <div className="flex items-center  justify-center w-10">
                        <MagnifyingGlassIcon className="w-5 h-5 text-white" />    
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold">{t("SearchFor")} &quot;{input}&quot;</p>
                    </div>
                </Link>
            </div>
        )        
    }

}