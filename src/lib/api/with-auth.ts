import { auth } from "@/lib/auth/auth";
import { Session } from "better-auth";
import { NextRequest, NextResponse } from 'next/server';
 
type Handler = (req: NextRequest, context?: any) => Promise<Response>;

// Taken from BetterAuth types. 
// Really, this should have been exported from the library but alas I have to copy it.
type ApiKey = {
    id: string;
    name: string | null;
    start: string | null;
    prefix: string | null;
    key: string;
    userId: string;
    refillInterval: number | null;
    refillAmount: number | null;
    lastRefillAt: Date | null;
    enabled: boolean;
    rateLimitEnabled: boolean;
    rateLimitTimeWindow: number | null;
    rateLimitMax: number | null;
    requestCount: number;
    remaining: number | null;
    lastRequest: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, any> | null;
    permissions?: {
        [key: string]: string[];
    } | null;
};

export type ContextWithAuth = {
    context?: any;
    session?: Session;
    apiKey?: {
        value: Omit<ApiKey, "key"> | null;
        valid: boolean | null;
    };
    userId?: string | undefined;
    params?: any;
}
 
export function withAuth(handler: Handler, authRequired?: boolean): Handler {
    if (authRequired === undefined) authRequired = true;

    return async (req, context: { params: any }) => {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        const { valid: API_KEY_VALID, key } = await auth.api.verifyApiKey({
            body: { key: req.headers.get("x-api-key") ?? "" },
        });

        if (!API_KEY_VALID && !session) return NextResponse.json({ message: "This API endpoint requires authentication." }, { status: 401 });

        const userId = session?.user.id || key?.userId;

        if (!userId) return NextResponse.json({ message: "User ID was not found in session or API key." }, { status: 400 });

        const enhancedContext = {
            ...context,
            session,
            apiKey: {
                value: key,
                valid: API_KEY_VALID,
            },
            userId,
            params: context.params
        };

        return handler(req, enhancedContext);
    };
}