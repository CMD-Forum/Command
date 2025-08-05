"use client";

import { createAuthClient } from "better-auth/react";

import {
    adminClient,
    apiKeyClient,
    passkeyClient,
    usernameClient
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "https://localhost:3000",
    plugins: [
        usernameClient(),
        passkeyClient(),
        apiKeyClient(),
        adminClient()
    ],
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("bearer_token") || ""
        },
        onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token");
            if (authToken) localStorage.setItem("bearer_token", authToken);
        }
    }
})

export const { signIn, signUp, useSession } = createAuthClient();