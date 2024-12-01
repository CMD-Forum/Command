import { GitHub } from "arctic";
import type { Session, User } from "lucia";
import { Lucia } from "lucia";
import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { adapter } from "./db";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
    getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username,
			email: attributes.email,
			emailVerified: attributes.emailVerified,
			description: attributes.description,
			createdAt: attributes.createdAt,
			image: attributes.image,
			role: attributes.role,
			githubId: attributes.github_id,
			public: attributes.public,
		};
	},
	getSessionAttributes: (attributes) => {
		return {
			ip_address: attributes.ip_address,
			fresh: attributes.fresh,
			userAgent: attributes.userAgent,
			isBot: attributes.isBot,
			browserName: attributes.browserName,
			browserVersion: attributes.browserVersion,
			deviceModel: attributes.deviceModel,
			deviceType: attributes.deviceType,
			deviceVendor: attributes.deviceVendor,
			osName: attributes.osName,
			osVersion: attributes.osVersion
		};
	}
});

export const github = new GitHub( 
	process.env.NODE_ENV === "production" ? process.env.GITHUB_CLIENT_ID_PROD! : process.env.GITHUB_CLIENT_ID!, 
	process.env.NODE_ENV === "production" ? process.env.GITHUB_CLIENT_SECRET_PROD! : process.env.GITHUB_CLIENT_SECRET!
);

declare module "lucia" {
	// eslint-disable-next-line no-unused-vars
	interface Register {
		Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
	interface DatabaseSessionAttributes {
		ip_address: string;
		fresh: boolean;
		userAgent: string;
		isBot: boolean;
		browserName: string;
		browserVersion: string;
		deviceModel: string;
		deviceType: string;
		deviceVendor: string;
		osName: string;
		osVersion: string;
	}
}

interface DatabaseUserAttributes {
	username: string;
    email: string;
	emailVerified: boolean;
	description: string;
	createdAt: Date;
	image: string;
	role: "ADMIN" | "MODERATOR" | "USER" | "NULL" | "DEFAULT"
	github_id: number;
	public: boolean;
}

/**
 * ## validateRequest
 * ---
 * Validates the session cookie and returns the user if correct.
 * @example
 * 	const { user } = await validateRequest();
 *	if (!user) {
 *		return redirect("/login");
 *	}
 *	return <h1>Hi, {user.username}!</h1>;
 */

export const getAuth = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);	
		
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch { /* empty */ }
		return result;
	}
);

/**
 * ## logout
 * ---
 * Logout the user.
 * @example
 *	<form action={logout}>
 *		<button>Sign out</button>
 *	</form>
 */

export async function logout(): Promise<ActionResult> {
	"use server";
	const { session } = await getAuth();
	if (!session) {
		redirect("/login");
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	redirect("/login");
}