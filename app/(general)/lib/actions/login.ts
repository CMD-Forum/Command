"use server";

import { verify } from "@node-rs/argon2";
import { Prisma } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { userAgent } from "next/server";

import { lucia } from "../auth";
import { prisma } from "../db";
import { logError } from "../utils";

export async function login(state: any, formData: FormData) {

    // await new Promise(resolve => setTimeout(resolve, 1000))
    // console.log({ formData });

    const headersList = headers();

    const userAgentStructure = {headers: headersList}
    const agent = userAgent(userAgentStructure)

    if (formData === undefined) {
        return { error: "Sorry, the form failed to submit." }
    }

    const username = formData.get("username") as string;
    if (typeof username !== "string") {
		return {
            // Obviously we don't want the user to see an error that they probably wouldn't understand, so in production a vague message is given.
			error: process.env.NODE_ENV === "development" ? "Username must be a string." : "Try refreshing the page and logging in again."
		};
	}
	const password = formData.get("password") as string;
	if (typeof password !== "string") {
		return {
            // Same thing here as above
			error: process.env.NODE_ENV === "development" ? "Password must be a string." : "Try refreshing the page and logging in again."
		};
	}

    try {

        const user = await prisma.user.findUnique({ where: { username: username } })  
        if ( !user || !user.password_hash ) {
            return { error: "Incorrect username or password."}
        }   

        const validPassword = await verify(user.password_hash, password);
        if ( !validPassword ) {
            return { error: "Incorrect username or password." }
        }

        const session = await lucia.createSession(user.id, {
            ip_address: headersList.get('x-real-ip') || headersList.get('x-forwarded-for') || "Unknown",
            userAgent: headersList.get('user-agent') || "Unknown",
            isBot: agent.isBot || false,
            browserName: agent.browser.name || "Unknown",
            browserVersion: agent.browser.version || "Unknown",
            deviceModel: agent.device.model || "Unknown",
            deviceType: agent.device.type || "Unknown",
            deviceVendor: agent.device.vendor || "Unknown",
            osName: agent.os.name || "Unknown",
            osVersion: agent.os.version || "Unknown",
            fresh: false
        });
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        
    } catch (error) {
        // Normal Errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch(error.code) {
                case "2007":
                    return { error: "The data could not be validated. Please refresh the page and try again." }
                case "P2024":
                    return { error: "The login timed out, please try again. If this keeps happening, our database may be experiencing issues." }
                default:
                    return { error: "Something went wrong when logging in, please try again." }
            }
        }
        // Unknown Errors (no code)
        if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            return { error: "Something went wrong when logging in, please try again." }
        }
        // Prisma Engine Crashes (unrelated to user)
        if (error instanceof Prisma.PrismaClientRustPanicError) {
            logError("Prisma Engine is reporting that it has crashed, please try restarting it immediately.")
            return { error: "The database is experiencing issues, please try again later." }
        }
        // Initalization Errors
        if (error instanceof Prisma.PrismaClientInitializationError) {
            logError("Prisma Engine is reporting that it has failed to initalize, please try restarting it immediately.")
            return { error: "The database is experiencing issues, please try again later." }
        }
        // Validation Errors
        if (error instanceof Prisma.PrismaClientValidationError) {
            logError("Prisma Engine is reporting that it has experienced the following error: \n" + error)
            return { error: "The database is experiencing issues, please try again later." }
        }
    }

    redirect('/posts');
}