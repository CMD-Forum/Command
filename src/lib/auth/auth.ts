import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { db } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, bearer, customSession, openAPI, username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
	emailAndPassword: {  
        enabled: true
    },
    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
            mapProfileToUser: (profile) => {
                return {
                    username: profile.login,
                };
            },
        }, 
    },
	plugins: [
        customSession(async ({ user, session }) => {
            const USER_DESCRIPTION = await db.user.findUnique({ where: { id: user.id }, select: { description: true } });
            const USER_ROLE = await db.user.findUnique({ where: { id: user.id }, select: { role: true } });

            return {
                user: {
                    ...user,
                    description: USER_DESCRIPTION?.description,
                    role: USER_ROLE?.role || "user",
                },
                session
            };
        }),        
		username(),
        passkey({
			rpID: "command-forum",
			rpName: "Command",
		}),
        apiKey(),
        bearer(),
        nextCookies(),
        openAPI(),
        admin()
    ],
    user: {
        deleteUser: {
            enabled: true,
        }
    }
    
    /// Redis is broken for some reason, so this is commented out for now.

    /*rateLimit: {
        enabled: true,
		storage: "secondary-storage"
    },
    secondaryStorage: {
		get: async (key) => {
			const value = await redis.get(key);
			return value ? value : null;
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, { EX: ttl });
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		}
	}*/
});