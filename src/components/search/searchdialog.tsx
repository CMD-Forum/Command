"use client";

import { BookOpenIcon, MagnifyingGlassIcon, RectangleStackIcon, UserIcon } from "@heroicons/react/16/solid";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ControlledDialog, DialogContent } from "../dialog/dialog";
import TextInput from "../input/text_input";
import Typography from "../misc/typography";

const DATA = {
    Account: {
        Username: {
            Name: "Username",
            Description: "Change your username every 30 days.",
            Type: "Setting"
        },
        Password: {
            Name: "Password",
            Description: "Change your password.",
            Type: "Setting"
        },
        PostVisibility: {
            Name: "Post Visibility",
            Description: "Change whether your posts can be seen by others.",
            Type: "Setting"
        },
    },
};

export default function SearchDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const t = useTranslations("Layout.Topbar.Search");
    const SEARCH_INPUT_REF = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.code === "KeyK") {
                event.preventDefault();
                setIsOpen(!isOpen);
                setTimeout(() => SEARCH_INPUT_REF.current?.focus(), 1);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => { document.removeEventListener("keydown", handleKeyDown) };
    }, [setIsOpen, isOpen])

    useEffect(() => {
        const SEARCH_QUERY = query.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const RESULTS: any[] = [];
        Object.entries(DATA.Account).forEach(([key, value]) => {
            if (
                value.Name.toLowerCase().includes(SEARCH_QUERY) ||
                value.Description.toLowerCase().includes(SEARCH_QUERY)
            ) {
                RESULTS.push({ key, ...value });
            }
        });
        setFilteredResults(RESULTS);
    }, [query]);

    return (
        <ControlledDialog isOpen={isOpen} setIsOpen={setIsOpen}>
            <DialogContent className="!p-2 min-w-[200px] w-[500px]">
                <TextInput 
                    label={t("SearchCommand")} 
                    tabIndex={0} 
                    ref={SEARCH_INPUT_REF} 
                    onChange={(e) => setQuery(e.target.value)}
                    icon={<MagnifyingGlassIcon />}
                    /*endIcon={<Button square variant="Secondary" className="!w-5 !h-5 !rounded-sm !p-0 !px-0" icon={<XMarkIcon />} onClick={() => setIsOpen(false)} />}*/ /* Commented out as the X mark is crushed by the padding, which I can't override. */
                    endIcon={<kbd className="h-5 w-fit cursor-pointer" aria-label={t("Escape")} onClick={() => setIsOpen(false)} tabIndex={0}>{"ESC"}</kbd>}
                />
                <div className="py-2">
                    { query 
                        ?
                            filteredResults.length > 0 ? (
                                    filteredResults.map((result) => (
                                        <Link
                                            key={result.key}
                                            href={`/settings#${result.Name}`}
                                            className="flex flex-col hover:bg-border focus-visible:bg-border outline-none focus-visible:outline-2 focus-visible:outline-white w-full h-fit p-3 rounded-sm transition-all"
                                        >
                                            <div className="flex items-center gap-1"><Typography variant="p">{result.Name}</Typography></div>
                                            <Typography variant="p" secondary>{result.Description}</Typography>
                                        </Link>
                                    ))
                                ) : (
                                    <Typography variant="p" secondary className="text-center m-2">{t("NoResults")}</Typography>
                            )
                        : 
                            <Typography variant="p" secondary className="text-center m-2">{t("StartSearching")}</Typography> 
                    }                    
                </div>
                <hr className="!py-1" />
                <div className="flex flex-col">
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}&type=${t("SearchTypes.Posts")}`}
                        className="flex flex-row gap-1 items-center hover:bg-border focus-visible:bg-border outline-none focus-visible:outline-2 focus-visible:outline-white w-full h-fit p-3 rounded-sm transition-all"
                    >
                        <BookOpenIcon className="w-4 h-4 text-secondary" />
                        <Typography variant="h6" secondary>{t("SearchPosts")}</Typography>
                    </Link>
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}&type=${t("SearchTypes.Communities")}`}
                        className="flex flex-row gap-1 items-center hover:bg-border focus-visible:bg-border outline-none focus-visible:outline-2 focus-visible:outline-white w-full h-fit p-3 rounded-sm transition-all"
                    >
                        <RectangleStackIcon className="w-4 h-4 text-secondary" />
                        <Typography variant="h6" secondary>{t("SearchCommunities")}</Typography>
                    </Link>
                    <Link
                        href={`/search?q=${encodeURIComponent(query)}&type=${t("SearchTypes.Users")}`}
                        className="flex flex-row gap-1 items-center hover:bg-border focus-visible:bg-border outline-none focus-visible:outline-2 focus-visible:outline-white w-full h-fit p-3 rounded-sm transition-all"
                    >
                        <UserIcon className="w-4 h-4 text-secondary" />
                        <Typography variant="h6" secondary>{t("SearchUsers")}</Typography>
                    </Link>
                </div>
            </DialogContent>
        </ControlledDialog>
    );
}