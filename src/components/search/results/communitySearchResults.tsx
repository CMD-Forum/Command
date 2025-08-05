import { ListError } from "@/components/misc/listError";
import Typography from "@/components/misc/typography";
import { legacy_logError } from "@/lib/utils";
import { Community } from "@prisma/client";
import { useTranslations } from "next-intl";

export function CommunitySearchResult({ community }: { community: Community }) {
    return (
        <div key={community.id} className="p-4 bg-foreground rounded-sm">
            <Typography variant="p">{community.name}</Typography>
            <Typography variant="p" secondary={true}>{community.description}</Typography>
        </div>
    )
}

export default function CommunitySearchResults({ results }: { results: Community[] }) {

    const t = useTranslations("/search");

    try {
        if (results.length !== 0) {
            return (
                <div className="flex flex-col gap-4 mt-4">
                    {results.map((community) => {
                        return (
                            <CommunitySearchResult community={community} key={community.id} />
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div className="mt-4">
                    <ListError title={`${t("Form.NoResultsTitle", { results: t("Form.SearchTypes.Communities") })}`} subtitle={t("Form.NoResultsSubtitle")} reloadButton={false} />
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