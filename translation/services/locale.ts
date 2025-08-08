"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale } from "../i18n/config";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "NEXT_LOCALE";

// This will always, always cause an error in new versions of Next.js that have dynamicIO/cacheComponents enabled.
// Next.js doesn't like this as it breaks prerendering or something like that.
// There's no way to fix this as far as I'm aware. Have to wait for an update from Next.js or next-intl.
// Really hope this doesn't break builds.
export async function getUserLocale() {
  	return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    (await cookies()).set(COOKIE_NAME, locale);
}