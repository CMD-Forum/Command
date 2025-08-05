"use client";

import { CommunitySidebarDataAPIResponse } from "@/app/api/v2/community/getSidebarData/byName/[communityName]/route";
import { Community, CommunityRule, User } from "@prisma/client";
import React, { createContext, use, useEffect, useState } from "react";
import { legacy_logError } from "../utils";

interface CommunityInformation {
    about: string;
    rules: CommunityRule[];
    moderators: Partial<User>[];
    related_communities: Partial<Community>[] | null;
}

interface CommunityContextValue {
    community: Partial<Community> | null;
    // eslint-disable-next-line no-unused-vars
    setCommunity: (community: Partial<Community>) => void;
    error: boolean | null;
    // eslint-disable-next-line no-unused-vars
    setError: (error: boolean) => void;
    information: CommunityInformation,
    // eslint-disable-next-line no-unused-vars
    setInformation: (information: CommunityInformation) => void;
    members: number;
    // eslint-disable-next-line no-unused-vars
    setMembers: (members: number) => void;
    posts: number;
    // eslint-disable-next-line no-unused-vars
    setPosts: (posts: number) => void;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export const useCommunity = () => {
    const CONTEXT = use(CommunityContext);
    if (!CONTEXT) throw new Error("useCommunity must be used within a CommunityProvider");
    return CONTEXT;
};

/**
 * ## CommunityProvider
 * ---
 * Provides context about a community. Used for `CommunitySidebar`.
 * @see {@link useFetchAndSetCommunity} - To set the context data
 * @param children Children for the context to be provided to.
 */

export const CommunityProvider = ({ children }: { children: React.ReactNode }) => {
    const [community, setCommunity] = useState<Community | null>({
        name: "all",
        id: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "The community for everything and anything!",
        image: "/TextPostFallback.png",
        bg_image: "/images/default_community_bg.png",
        sidebar_content: "# The community for anything and everything.\nWelcome to the front page of Command, where the best posts go!",
        public: true
    });
    const [information, setInformation] = useState({
        about: "# The community for anything and everything.\nWelcome to the front page of Command, where the best posts go!",
        rules: [{ 
            id: "0", 
            createdAt: new Date(), 
            updatedAt: new Date(), 
            communityID: "0", 
            title: "Normal sitewide rules apply.",
            description: "Please visit the rules page for more information." 
        }],
        moderators: [{ username: "Command", image: "/metadata/Logo-512x512.svg", description: "For any non-development issues, please contact an administrator. Contact a GitHub contributor for development issues." }],
        related_communities: null
    });
    const [members, setMembers] = useState(0);
    const [posts, setPosts] = useState(0);

    const [error, setError] = useState<boolean | null>(false);

    return (
        <CommunityContext.Provider value={{ 
            community, 
            // @ts-expect-error: Type mismatch, should be fine.
            setCommunity, 
            error, 
            setError,
            information,
            // @ts-expect-error: Type mismatch, should be fine.
            setInformation,
            members,
            setMembers,
            posts,
            setPosts
        }}>
            {children}
        </CommunityContext.Provider>
    );
};

/**
 * ## useFetchAndSetCommunity
 * ---
 * Fetches community data from the API and replaces the current community context data with the retrieved data.
 * @param {"ID" | "Name"} fetchBy Specify `ID` or `Name`. This is whether you're fetching the data by the name or ID of the community.
 * @param {string} identifier The name or ID of the community, based on what you picked for `fetchBy`.
 * @returns `success` or `error`. Neither have to be used, they're just there for debugging and/or convenience.
 */

export function useFetchAndSetCommunity({ fetchBy, identifier }: { fetchBy: "ID" | "Name", identifier: string }) {
    const { setCommunity, setInformation, setMembers, setPosts, setError } = useCommunity();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const RES = await fetch(`/api/v2/community/getSidebarData/by${fetchBy}/${identifier}`);

                if (!RES.ok) {
                    setError(true);
                    return { error: "Response was not OK." };
                }

                const { response: RESPONSE, error } = await RES.json() as CommunitySidebarDataAPIResponse;

                if (error) {
                    setError(true);
                    return { error: "The following error occurred: " + error };
                }

                setCommunity({
                    name: RESPONSE.community.name,
                    image: RESPONSE.community.image || "/TextPostFallback.png",
                    description: RESPONSE.community.description,
                    createdAt: RESPONSE.community.createdAt,
                });

                console.log("res about:", RESPONSE.information.about)

                setInformation({
                    about: RESPONSE.information.about,
                    rules: RESPONSE.information.rules,
                    moderators: RESPONSE.information.moderators,
                    related_communities: RESPONSE.information.related_communities,
                });

                setMembers(RESPONSE.members || 0);
                setPosts(RESPONSE.posts || 0);

            } catch (error) {
                setError(true);
                legacy_logError("Failed to fetch community data: " + error);
                return { error: "Failed to fetch community data: " + error };
            }
        };

        fetchData();
    }, [setCommunity, setInformation, setMembers, setPosts, setError, fetchBy, identifier]);

    return { success: "Community context was successfully updated." }
}