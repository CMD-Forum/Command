"use client";

import Typography from "../misc/typography";

import { useCommunity } from "@/lib/context/community";
import dayjs from "@/lib/dayjs";
import { Community, CommunityRule, User } from "@prisma/client";
import { Calendar, Info, LayoutList, Logs, Mail, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ExtendedMarkdown from "../markdown/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

/**
 * ## CommunitySidebar
 * ---
 * Sidebar that displays important information about the specified community.
 * Community can be passed as a prop *(not recommended)* or from context.
 * @see {@link https://github.com/CMD-Forum/CMD-Forum/tree/src/lib/context/community.tsx#L49} - Provides context to this component.
 */

export default function CommunitySidebar({ 
    community = { name: "all", image: "/TextPostFallback.png", description: "The community for anything and everything.", createdAt: new Date() },
    members = 0,
    posts = 0,
    information = { 
        about: "# The community for anything and everything.\nWelcome to the front page of Command, where the best posts go!",
        rules: [{
            title: "Normal sitewide rules apply.", description: "Please visit the rules page for more information.",
            id: "0",
            createdAt: new Date(),
            updatedAt: new Date(),
            communityID: "0"
        }],
        moderators: [{ username: "Command", image: "/TextPostFallback.png" }],
        related_communities: null
    },
}: { 
    community?: { 
        name: string;
        image: string;
        description: string; 
        createdAt: Date;
    },
    members?: number,
    posts?: number,
    information?: {
        about: string;
        rules: CommunityRule[];
        moderators: Partial<User>[];
        related_communities: Partial<Community>[] | null;
    },
}) {
    const t = useTranslations("Layout.CommunitySidebar")
    const CONTEXT = useCommunity();

    // const [isLoading, setIsLoading] = useState(true);

    const ACTIVE_COMMUNITY = CONTEXT.community ? CONTEXT.community: community;
    const ACTIVE_MEMBERS = CONTEXT.members ? CONTEXT.members: members;
    const ACTIVE_POSTS = CONTEXT.posts ? CONTEXT.posts: posts;
    const ACTIVE_INFORMATION = CONTEXT.information ? CONTEXT.information: information;

    if (!ACTIVE_COMMUNITY || CONTEXT.error) return (
        <Card className="hidden 2xl:flex flex-col w-[500px] min-w-[500px] gap-4 h-fit">
            <CardHeader>
                <CardTitle>{t("FetchFailed")}</CardTitle>
                <CardDescription>{t("FetchFailedDescription")}</CardDescription>
            </CardHeader>
        </Card>
    );

    return (
        <Card className="hidden 2xl:flex flex-col w-[500px] min-w-[500px] gap-4 h-fit">
            <CardHeader>
                <CardTitle>{ACTIVE_COMMUNITY.name}</CardTitle>
                <CardDescription>{ACTIVE_COMMUNITY.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 mb-2">
                    <div className="flex gap-4">
                        <div className="flex gap-1 items-center">
                            <UserIcon className="w-4 h-4 text-foreground" />
                            <Label className="text-muted-foreground">{ACTIVE_MEMBERS !== undefined ? ACTIVE_MEMBERS.toString() : "N/A"}</Label>
                        </div>
                        <div className="flex gap-1 items-center">
                            <Calendar className="w-4 h-4 text-foreground" />
                            <Label className="text-muted-foreground">{ACTIVE_COMMUNITY.createdAt !== undefined ? dayjs(ACTIVE_COMMUNITY.createdAt).format("DD/MM/YY") : "N/A"}</Label>
                        </div>
                        <div className="flex gap-1 items-center">
                            <LayoutList className="w-4 h-4 text-foreground" />
                            <Label className="text-muted-foreground">{ACTIVE_POSTS !== undefined ? ACTIVE_POSTS.toString() : "N/A"}</Label>
                        </div>
                    </div>                
                </div>
                <div className="flex flex-col">
                    <Accordion type="multiple">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>{t("Accordion.About")}</AccordionTrigger>
                            <AccordionContent>
                                {ACTIVE_INFORMATION.about.length != 0 
                                ?
                                    <div className="prose">
                                        <ExtendedMarkdown content={ACTIVE_INFORMATION.about} />
                                    </div>                                
                                :
                                    <Label className="!text-muted-foreground">{t("NoAbout")}</Label>
                                }

                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>{t("Accordion.Rules")}</AccordionTrigger>
                            <AccordionContent>
                                {ACTIVE_INFORMATION.rules.length != 0 ? ACTIVE_INFORMATION.rules.map((rule: CommunityRule, index: number) => {
                                    return (
                                        <div key={index} className="flex bg-grey-one rounded-sm p-4 gap-2 transition-all w-full items-start">
                                            <Typography variant="p">{index + 1}.</Typography>
                                            <div className="flex flex-col">
                                                <Typography variant="p">{rule.title}</Typography>
                                                <Typography variant="p" secondary>{rule.description}</Typography>                                        
                                            </div>
                                        </div>
                                    );
                                }) : <Label className="!text-muted-foreground">{t("NoRules")}</Label>}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>{t("Accordion.Moderators")}</AccordionTrigger>
                            <AccordionContent>
                                {ACTIVE_INFORMATION.moderators.length != 0 ? ACTIVE_INFORMATION.moderators.map((moderator: Partial<User>, index) => {
                                    return (
                                        <Link key={moderator.id || index} href={`/user/${moderator.username}`} className="flex gap-2 transition-all w-full items-center">
                                            <Avatar>
                                                {/* @ts-ignore */}
                                                <AvatarImage src={moderator.image} alt={moderator.username} />
                                                <AvatarFallback>{moderator.username?.slice(0,2)}</AvatarFallback>
                                            </Avatar>
                                            <Label className="!text-foreground hover:!text-foreground hover:underline transition-all">{moderator.username}</Label>
                                        </Link>
                                    );
                                }) : <Label className="!text-muted-foreground">{t("NoModerators")}</Label>}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" asChild><a href={`/c/${community.name}/wiki`}><Info />{t("Buttons.Wiki")}</a></Button>
                <Button variant="outline" asChild><a href={`/c/${community.name}/moderation/logs`}><Logs />{t("Buttons.ModerationLogs")}</a></Button>
                <Button variant="outline" asChild><a href={`/c/${community.name}/moderation/contact`}><Mail />{t("Buttons.Contact")}</a></Button>
            </CardFooter>
        </Card>
    );
}