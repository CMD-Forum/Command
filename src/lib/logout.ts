"use server";

import { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// import { getAuth, lucia } from "./auth/auth";

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
	return null;

	const { session } = await getAuth();
	if (!session) {
		redirect("/login");
	}

	await lucia.invalidateSession(session.id);

	const SESSION_COOKIE = lucia.createBlankSessionCookie();
	(await cookies()).set(SESSION_COOKIE.name, SESSION_COOKIE.value, SESSION_COOKIE.attributes);
	redirect("/login");
}

export async function action_invalidateSession( sessionID: string, redirectURL?: string ): Promise<ActionResult> {
	return null;

	await lucia.invalidateSession(sessionID)
	redirect(redirectURL ? redirectURL : "/");
}

export async function action_invalidateAllSessions( userID: string, redirectURL?: string ): Promise<ActionResult> {
	return null;

	await lucia.invalidateUserSessions(userID)
	redirect(redirectURL ? redirectURL : "/");
}