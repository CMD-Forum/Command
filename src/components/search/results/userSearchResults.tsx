import { ListError } from "@/components/misc/listError";
import Typography from "@/components/misc/typography";
import { legacy_logError } from "@/lib/utils";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function UserSearchResult({ user }: { user: User }) {
    return (
        <div key={user.id} className="p-4 bg-foreground rounded-sm">
            <Link href={`/user/${user.username}`} className="w-fit"><Typography variant="p" className="hover:underline w-fit">{user.username}</Typography></Link>
            <Typography variant="p" secondary={true}>{user.description}</Typography>
        </div>
    )
}

export default function UserSearchResults({ results }: { results: User[] }) {

    const t = useTranslations("/search");

    try {
        if (results.length !== 0) {
            return (
                <div className="flex flex-col gap-4 mt-4">
                    {results.map((user) => {
                        return (
                            <UserSearchResult user={user} key={user.id} />
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div className="mt-4">
                    <ListError title={`${t("Form.NoResultsTitle", { results: t("Form.SearchTypes.Users") })}`} subtitle={t("Form.NoResultsSubtitle")} reloadButton={false} />
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