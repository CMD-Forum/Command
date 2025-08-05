"use server";

import ogs from "open-graph-scraper";

export default async function getOGS({ url }: { url: string }) {
    const RESULT = ogs({ url: url });
    return RESULT;
}
