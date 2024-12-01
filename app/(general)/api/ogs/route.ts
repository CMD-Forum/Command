import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";

import { lucia } from "../../lib/auth";
import getOGS from "../../lib/ogs";
import { logError, logWarning } from "../../lib/utils";

export async function POST( req: Request ) {

    try {

        // Handily taken from Lucia Docs (bottom of https://lucia-auth.com/guides/validate-session-cookies/nextjs-app)
        const originHeader = req.headers.get("Origin");
        // NOTE: You may need to use `X-Forwarded-Host` instead
        const hostHeader = req.headers.get("Host");
        if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
            const authorizationHeader = req.headers.get("Authorization");
            const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
    
            if ( ! sessionId) {
                return new NextResponse(null, {
                    status: 401
                });
            }   
            
            const { user } = await lucia.validateSession(sessionId);
    
            if ( ! user?.id ) {
                return new NextResponse(null, {
                    status: 401
                });
            }
        }

        const body = await req.json();
        let { url } = body;
        if ( ! url ) {
            return NextResponse.json({ message: "URL is required." }, { status: 400 });
        }

        const result = await getOGS({ url: url });

        if (result.error === false) {
            return NextResponse.json(result, { status: 200 })    
        } else {
            logError("Unknown error occurred in OGS Api Endpoint.")
            return NextResponse.json({ message: "Error occurred while fetching OGS data." }, { status: 500 })
        }
        
    } catch (error) {
        // @ts-ignore
        logWarning("OGS Request Failed: " + error.result.error + " at " + error.result.requestUrl);
        // @ts-ignore
        return NextResponse.json({ message: "OGS Request Failed: " + error.result.error + " at " + error.result.requestUrl }, { status: 500 })
    }
}