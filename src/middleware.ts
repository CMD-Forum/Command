import { NextResponse } from "next/server";

import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";
// import RateLimit from "./lib/api/ratelimit";

export async function middleware(request: NextRequest) {

    // CSRF

	/*if (request.method === "GET") return NextResponse.next();

	const NONCE = Buffer.from(crypto.randomUUID()).toString("base64")

	const CSP_HEADER = `
		default-src 'self';
		script-src 'self' 'nonce-${NONCE}' 'strict-dynamic';
		style-src 'self' 'nonce-${NONCE}';
		img-src 'self' blob: data:;
		font-src 'self';
		object-src 'none';
		base-uri 'self';
		form-action 'self';
		frame-ancestors 'none';
		upgrade-insecure-requests;
	`

	const CSPHV = CSP_HEADER
    .replace(/\s{2,}/g, " ")
    .trim()
 
	const REQUEST_HEADERS = new Headers(request.headers)
	REQUEST_HEADERS.set("x-nonce", NONCE)
	REQUEST_HEADERS.set("Content-Security-Policy", CSPHV);
	REQUEST_HEADERS.set("X-Content-Type-Options", "nosniff");
	
	const RESPONSE = NextResponse.next({ request: { headers: REQUEST_HEADERS } });

	RESPONSE.headers.set("Access-Control-Allow-Origin", "*");
    RESPONSE.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
    RESPONSE.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
	RESPONSE.headers.set("Content-Security-Policy", CSPHV)*/

    const session = await auth.api.getSession({
        headers: await headers()
    })

	if (!session) {
		if (
			request.nextUrl.pathname.startsWith("/create") ||
			request.nextUrl.pathname.startsWith("/posts/saved") ||
			request.nextUrl.pathname.startsWith("/settings") ||
			request.nextUrl.pathname.startsWith("/dashboard")
		) NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	runtime: "nodejs",
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}