"use client";

import { ChartNoAxesCombined, ChevronDown, ClockFading, Flame, MessageCircleMore, Newspaper, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { PostNew } from "@/components/posts/post";
import { log } from "@/lib/utils";
import { Post as PostType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import CreateDialog from "../create/create_dialog";
import { ListError } from "../misc/listError";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";

export default function PostList({
    url,
    method = "GET",
    extraHeaders,
    extraBodyParams,
    externalPage,
    setExternalPage,
    externalSort,
    setExternalSort,
}: {
    url: string | URL;
    method?: string;
    extraHeaders?: Record<string, string>;
    extraBodyParams?: Record<string, string>;
    externalPage?: number;
    setExternalPage?: Dispatch<SetStateAction<number>>;
    externalSort?: string;
    setExternalSort?: Dispatch<SetStateAction<string>>;
}) {

    const t = useTranslations("Components.PostList");

    const [totalPosts, setTotalPosts] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [errorCode, setErrorCode] = useState<string | number>();

    const [internalSort, setInternalSort] = useState<string>(t("Sorts.Hot"));
    const sort = externalSort ?? internalSort;
    const setSort = setExternalSort ?? setInternalSort;

    const [internalPage, setInternalPage] = useState<number>(0);
    const page = externalPage ?? internalPage;
    const setPage = setExternalPage ?? setInternalPage;

    const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

    // const token = localStorage.getItem("bearer_token");

    const FETCH_OPTIONS = useMemo(() => ({
        method: method || "GET",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`,
            ...extraHeaders
        },
        body: method !== "GET" ? JSON.stringify({ ...extraBodyParams }) : null,
    }), [method, /*token,*/ extraHeaders, extraBodyParams]);

    const { data: posts, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["post_list", sort, extraHeaders, extraBodyParams, page, url, method, /*token,*/ internalSort, FETCH_OPTIONS],
        queryFn: async () => {
            if (sort !== internalSort) setPage(0);
    
            const res = await fetch(`${url}?sort=${sort}&page=${page}`, FETCH_OPTIONS);

            if (errorCode) setErrorCode(res.status);
            // if (!res.ok) throw new Error(`Error ${res.status}`);

            const data = await res.json();
            setTotalPosts(data.postCount);
            setTotalPages(Math.ceil(data.postCount / 10));
            return data.posts;
        },
        retry: 1
    });

    const LOADING_SKELETONS = [];
    for (let i = 0; i < 10; i++) LOADING_SKELETONS.push(<Skeleton className="h-[138px] !rounded-sm" key={i} />);
    
    if (posts <= 0  || posts === null) return <ListError title={t("Error.NoPosts")} reloadButton />;

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
        <div className="flex flex-col w-full">
            <Card className="flex !flex-row !px-6 justify-between w-full mb-2 items-center">
                <div className="flex gap-2">
                    <Select defaultValue={sort} onValueChange={setSort}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("Sorts.Sort")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hot"><Flame />{t("Sorts.Hot")}</SelectItem>
                            <SelectItem value="New"><Newspaper />{t("Sorts.New")}</SelectItem>
                            <SelectItem value="Old"><ClockFading />{t("Sorts.Old")}</SelectItem>
                            <SelectItem value="Top"><ChartNoAxesCombined />{t("Sorts.Top")}</SelectItem>
                            <SelectItem value="Controversial"><TrendingDown />{t("Sorts.Controversial")}</SelectItem>
                            <SelectItem value="Comments"><MessageCircleMore />{t("Sorts.Comments")}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={() => setFiltersExpanded(!filtersExpanded)}
                        aria-label={t("Filters.Toggle.ToggleLabel", { expandOrClose: filtersExpanded ? t("Filters.Toggle.Close") : t("Filters.Toggle.Expand") })}
                        size={"icon"}
                        disabled
                    >
                        <ChevronDown className={`${filtersExpanded && "rotate-180"} transition-all`} />
                    </Button>
                </div>   
                <CreateDialog />                 
            </Card>
            <div className="mt-2" />
            { isLoading 
            ?
                <>
                    <div className="flex flex-col gap-4 w-full">{LOADING_SKELETONS}</div>
                    <Skeleton className="mt-4 w-full" />
                </>
            : 
                <>
                    <div className="flex flex-col gap-4 w-full">
                        {Array.isArray(posts) && posts.map((post: Partial<PostType> & { 
                            id: string, 
                            createdAt: string,
                            updatedAt: string,                            
                            title: string,
                            content: string,
                            imageurl: string | null,
                            imageblur: string | null,
                            imagealt: string | null,
                            public: boolean,
                            href: string | null,
                            deletedByAdmin: boolean,
                            deletedByAuthor: boolean,
                            community: { 
                                id: string,
                                name: string,
                            },
                            author: {
                                id: string,
                                username: string;
                            }
                        }) => {
                            return (
                                <div key={post.id} className="w-full">
                                    <PostNew
                                        id={post.id}
                                        createdAt={post.createdAt}
                                        updatedAt={post.updatedAt}
                                        title={post.title}
                                        content={post.content}
                                        imageurl={post.imageurl}
                                        imageblur={post.imageblur}
                                        imagealt={post.imagealt}
                                        public={post.public}
                                        author={post.author}
                                        community={post.community}
                                        href={post.href}
                                        deletedByAdmin={post.deletedByAdmin}
                                        deletedByAuthor={post.deletedByAuthor}
                                    />
                                </div>
                            );
                        })}                
                    </div>

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
                </>
            }
        </div>
    );
}
