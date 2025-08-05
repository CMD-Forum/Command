"use client";

import searchCommunities from "@/lib/actions/search/searchCommunities";
import searchPosts from "@/lib/actions/search/searchPosts";
import searchUsers from "@/lib/actions/search/searchUsers";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "../button/button";
import TextInput from "../input/text_input";
import ListLoader from "../misc/listLoader";
import Select, { Option, SelectContent } from "../select/select";
import CommunitySearchResults from "./results/communitySearchResults";
import PostSearchResults from "./results/postSearchResults";
import UserSearchResults from "./results/userSearchResults";

export default function SearchForm() {

    const t = useTranslations("/search");
    const [type, setType] = useState<string>(decodeURIComponent(useSearchParams().get("type") || "") || t("Form.SearchTypes.Posts"));

    const INITIAL_STATE = {
        RESULT: [],
        ERROR: "",
    }

    const [postsState, postsFormAction] = useActionState(searchPosts, INITIAL_STATE);
    const [communitiesState, communitiesFormAction] = useActionState(searchCommunities, INITIAL_STATE);
    const [usersState, usersFormAction] = useActionState(searchUsers, INITIAL_STATE);
    const [searchTerm, setSearchTerm] = useState<string>(decodeURIComponent(useSearchParams().get("q") || ""));

    const ROUTER = useRouter();
    const PATHNAME = usePathname();

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const NEW_SEARCH_TERM = event.target.value;
        setSearchTerm(NEW_SEARCH_TERM);
        ROUTER.push(`${PATHNAME}?q=${encodeURIComponent(NEW_SEARCH_TERM)}`)
    };

    const getAction = () => {
        switch (type) {
            case t("Form.SearchTypes.Posts"):
                return postsFormAction;
            case t("Form.SearchTypes.Communities"):
                return communitiesFormAction;
            case t("Form.SearchTypes.Users"):
                return usersFormAction;
            default:
                return postsFormAction;
        }
    };

    const { pending } = useFormStatus();
    if (pending) return <ListLoader />

    return (
        <div>
            <Form action={getAction()}>
                <div className="flex flex-col lg:flex-row gap-2 p-4 rounded-sm bg-foreground items-center">
                    <TextInput label={`Search ${type}`} name="searchTerm" id="searchTerm" value={searchTerm} onChange={onInputChange} />
                    <div className="flex gap-2">
                        <Select label={t("Form.SearchTypes.Type")} defaultSelection={type} onSelect={setType} defaultPlacement="bottom-end">
                            <SelectContent>
                                <Option label={t("Form.SearchTypes.Posts")} />
                                <Option label={t("Form.SearchTypes.Communities")} />
                                <Option label={t("Form.SearchTypes.Users")} />
                            </SelectContent>
                        </Select>
                        <SubmitButton />
                    </div>
                </div>
            </Form>

            { type === t("Form.SearchTypes.Users") && !pending && <UserSearchResults results={usersState?.RESULT || []} /> }
            { type === t("Form.SearchTypes.Communities") && !pending && <CommunitySearchResults results={communitiesState?.RESULT || []} /> }
            { type === t("Form.SearchTypes.Posts") && !pending && <PostSearchResults results={postsState?.RESULT || []} /> }
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button submitBtn={true} variant="Primary" className="!h-[40px] !w-[40px] justify-center" icon={<MagnifyingGlassIcon />} loading={pending} square />
    );
}