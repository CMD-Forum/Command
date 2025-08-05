import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "./auth/auth";
import { log } from "./utils";

class CustomError extends Error {}

export const actionClient = createSafeActionClient({
    handleServerError(e) {
        log({ message: "Action error:" + e.message, type: "error", scope: "Server Action" });
    
        if (e instanceof CustomError) return e.message;
    
        return DEFAULT_SERVER_ERROR_MESSAGE;
    },
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
})

export const actionClientAuth = actionClient
.use(async ({ next }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) throw new Error("Session is not valid!");

    return next({ ctx: { session, user: session.user } });
});