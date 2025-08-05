import Image from "@/components/misc/image";
import { Community } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function CardCommunity({ community }: { community: Community }) {

    const t = useTranslations("Components.Community");

    return (
        <Card>
            <div className="flex w-full">
                {community.image
                    ?
                        <Image
                            width={512}
                            height={512}
                            src={community.image}
                            alt={""}
                            className={"rounded-sm hidden sm:flex sm:!max-w-[40px] sm:!min-w-[40px] sm:!h-[40px] sm:!w-[40px] ml-6 overflow-hidden bg-cover"} 
                        />
                    :
                        <Image
                            width={512}
                            height={512}
                            src={"/TextPostFallback.svg"}
                            alt={t("CommunityHasNoImage")}
                            className={"rounded-sm hidden sm:flex sm:!max-w-[40px] sm:!min-w-[40px] sm:!h-[40px] sm:!w-[40px] ml-6 overflow-hidden bg-cover"} 
                        />
                }
                <CardHeader className="w-full">
                    <CardTitle>{community.name}</CardTitle>
                    <CardDescription>{community.description}</CardDescription>
                </CardHeader>                
            </div>
        </Card>
    )
}

        {/*<div className="flex flex-col sm:flex-row w-full items-center gap-4 relative group transition-all bg-grey-one border-0 border-border group-hover/title:!border-white h-fit rounded-sm p-6">
            <div className="flex w-full bg-transparent h-fit flex-row items-center">
                {community.image
                    ?
                        <Image
                            width={512}
                            height={512}
                            src={community.image}
                            alt={""}
                            className={"rounded-sm hidden sm:flex sm:!max-w-[40px] sm:!min-w-[40px] sm:!h-[40px] sm:!w-[40px] mr-6 overflow-hidden bg-cover"} 
                        />
                    :
                        <Image
                            width={512}
                            height={512}
                            src={"/TextPostFallback.png"}
                            alt={t("CommunityHasNoImage")}
                            className={"rounded-sm hidden sm:flex sm:!max-w-[40px] sm:!min-w-[40px] sm:!h-[40px] sm:!w-[40px] mr-6 overflow-hidden bg-cover"} 
                        />
                }
                <div className="flex flex-row justify-between w-full items-center">
                    <div className="w-fit h-fit justify-center flex flex-col">
                        <Link href={`/c/${community.name.toLowerCase()}`} className="text-white w-fit font-sans font-semibold text-[18px] md:text-lg transition-all">{community.name}</Link>
                        <Typography variant="p" secondary={true}>{community.description !== "This community doesn't have a description." ? community.description : t("CommunityHasNoDescription") || t("CommunityHasNoDescription")}</Typography>
                    </div>
                    <Button variant="Secondary" disabled={true}>{t("Join")}</Button>
                </div>
            </div>
        </div>*/}