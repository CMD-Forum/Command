"use client";

import { authClient } from "@/lib/auth/auth-client";
import { log } from "@/lib/utils";
import { Community } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ListError } from "../misc/listError";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";
import CardCommunity from "./communityCard";

export default function CommunityList() {
    const { data: SESSION } = authClient.useSession();
    const t = useTranslations("Components.CommunityList");
    
    const [page, setPage] = useState(0);
    const [totalCommunities, setTotalCommunities] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [errorCode, setErrorCode] = useState<string | number>();
    const [sort, setSort] = useState<string>(t("Sorts.Hot"));

    const URL = `/api/community/getAll/${page}`;

    // const token = localStorage.getItem("bearer_token");

    const FETCH_OPTIONS = useMemo(() => ({
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
        },
    }), []);

    const { data: communities, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["community_list", page, URL, /*SESSION?.session?.id,*/ FETCH_OPTIONS],
        queryFn: async () => {
            setPage(0);
    
            const res = await fetch(`${URL}?sort=${sort}&page=${page}`, FETCH_OPTIONS);

            setErrorCode(res.status);
            if (!res.ok) throw new Error(`Error ${res.status}`);

            const data = await res.json();
            setTotalCommunities(data.communityCount);
            setTotalPages(Math.ceil(data.communityCount / 10));
            return data.communities;
        },
        retry: 1
    });

    const LOADING_SKELETONS = [];
    for (let i = 0; i < 10; i++) LOADING_SKELETONS.push(<Skeleton className="h-[92px] !rounded-sm" key={i} />);

    if (isLoading) return <div className="flex flex-col gap-4 w-full">{LOADING_SKELETONS}</div>;
    
    if (communities <= 0 || communities === null || !communities) return <ListError title={t("Error.NoCommunities")} reloadButton />;

    if (isError) {
        log({ type: "error", message: error, scope: "post_list.tsx" });
        switch (errorCode) {
            case 500:
                return <ListError title={t("Error.CouldNotFetch")} reloadButton reloadFunction={refetch} />
            case 401:
                return <ListError title={t("Error.Unauthorized")} reloadButton reloadFunction={refetch} />
            case 403:
                return <ListError title={t("Error.Unauthorized")} reloadButton reloadFunction={refetch} />
            default:
                return <ListError title={t("Error.CouldNotFetch")} reloadButton reloadFunction={refetch} />
        }
    }
    
    return (
        <div className="flex flex-col w-full gap-4">
            {Array.isArray(communities) && communities.map((community: Community) => {
                return (
                    <CardCommunity community={community} key={community.id} />
                );
            })}
            <Pagination className="mt-4 justify-start w-fit mx-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={page > 0 ? () => setPage(page - 1) : undefined}
                            aria-disabled={page === 0}
                            className={page === 0 ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationLink 
                            onClick={() => setPage(0)}
                            isActive={page === 0}
                        >
                            {"1"}
                        </PaginationLink>
                    </PaginationItem>

                    {totalPages > 7 && page > 3 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {Array.from({ length: totalPages })
                        .map((_, index) => index)
                        .filter(p => p > 0 && p < totalPages - 1 && (p >= page - 2 && p <= page + 2))
                        .map(p => (
                            <PaginationItem key={p}>
                                <PaginationLink 
                                    onClick={() => setPage(p)}
                                    isActive={p === page}
                                >
                                    {p + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))
                    }

                    {totalPages > 7 && page < totalPages - 4 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {totalPages > 1 && (
                        <PaginationItem>
                            <PaginationLink 
                                onClick={() => setPage(totalPages - 1)}
                                isActive={page === totalPages - 1}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext 
                            onClick={page < totalPages - 1 ? () => setPage(page + 1) : undefined}
                            aria-disabled={page === totalPages - 1}
                            className={page === totalPages - 1 ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}