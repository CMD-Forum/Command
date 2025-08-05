import { ListError } from "@/components/misc/listError";
import Typography from "@/components/misc/typography";
import { legacy_logError } from "@/lib/utils";
import { Post as PostType } from "@prisma/client";
import { useTranslations } from "next-intl";

export function PostSearchResult({ post }: { post: PostType }) {
    return (
        <div key={post.id} className="p-4 bg-foreground rounded-sm">
            <Typography variant="p">{post.title}</Typography>
            <Typography variant="p" secondary={true}>{post.content}</Typography>
        </div>
    )
}

export default function PostSearchResults({ results }: { results: PostType[] }) {

    const t = useTranslations("/search");

    try {
        if (results.length !== 0) {
            return (
                <div className="flex flex-col gap-4 mt-4">
                    {results.map((post) => {
                        return (
                            <PostSearchResult post={post} key={post.id} />
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div className="mt-4">
                    <ListError title={`${t("Form.NoResultsTitle", { results: t("Form.SearchTypes.Posts") })}`} subtitle={t("Form.NoResultsSubtitle")} reloadButton={false} />
                </div>
            );
        }        
    } catch(error) {
        legacy_logError(error);
        return (
            <div className="mt-4">
                <ListError title={`${t("Form.SearchErrorTitle")}`} subtitle={t("Form.SearchErrorSubtitle")} reloadButton={true} />    
            </div>
        );
    }
}