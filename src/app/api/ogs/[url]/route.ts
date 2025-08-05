//import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";

//import { lucia } from "@/lib/auth";
import getOGS from "@/lib/ogs";
import { legacy_logError, legacy_logWarning } from "@/lib/utils";

export interface OGSError {
    result: {
        error: string;
        requestUrl: string;
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ url: string }> }) {
    try {
        const { url } = await params;
        if (!url) return NextResponse.json({ message: "URL is required." }, { status: 400 });

        const result = await getOGS({ url: url });

        if (result.error === false) {
            return NextResponse.json(result, { status: 200 })    
        } else {
            legacy_logError("Unknown error occurred in OGS API endpoint.")
            return NextResponse.json({ message: "Error occurred while fetching OGS data." }, { status: 500 })
        }
        
    } catch (error) {
        legacy_logWarning("OGS Request Failed: " + error + " at " + error);
        return NextResponse.json({ message: "OGS request failed, this URL may be blocking the scraper."}, { status: 500 });
    }
}