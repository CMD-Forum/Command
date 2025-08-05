"use server";

import { headers } from "next/headers";
import { Community } from "../../../../generated/prisma";
import { StandardDataResponse } from "../types";

/**
 * createCommunity
 * ---
 * Creates a community with the given data.
 * @param data
 */

export async function createCommunity(data: {
    name: string;
    description: string;
    sidebar_content: string;
    image_url: string;
}): Promise<StandardDataResponse<{ community: Community }>> {

    const host = (await headers()).get("host");
    const cookie = (await headers()).get("cookie") ?? "";

    const res = await fetch(`https://${host}/api/v2/community/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
        },
        body: JSON.stringify(data),
    });

    const JSONres = await res.json();

    if (!res.ok) return { response: null, error: JSONres, status: res.status }

    return { response: { community: JSONres.response }, error: null, status: 200 }
}

/**
 * searchCommunities
 * ---
 * Searches the database for communities that match the specified filters.
 * @param data
 */

export async function searchCommunities(data: {
    search_query: string;
}): Promise<StandardDataResponse<{ communities: Community[] }>> {

    const host = (await headers()).get("host");

    const res = await fetch(`https://${host}/api/v2/community/search?query=${data.search_query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const JSONres = await res.json();

    if (!res.ok) return { response: null, error: JSONres, status: res.status }

    return { response: { communities: JSONres.response }, error: null, status: 200 }
}