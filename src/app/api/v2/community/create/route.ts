import { NextResponse } from "next/server";

import { ContextWithAuth, withAuth } from "@/lib/api/with-auth";
import HandleZodError from "@/lib/api/zod-error-handler";
import { db } from "@/lib/db";
import { log } from "@/lib/utils";
import { Prisma } from "../../../../../../generated/prisma/client";

import z from "zod/v4";

export const communityCreateSchema = z.object({
    name: z
        .string({ error: (issue) => issue.input === undefined 
            ? "Field 'name' is required." 
            : "Field 'name' expects a string, which it was not given."
        })
        .min(2, {
            message: "community names have to be 2 characters or over.",
        })
        .max(20, {
            message: "Community names have a maximum of 20 characters.",
        })
        .transform(value => value.replace(/\s+/g, "")),
    description: z
        .string({ error: (issue) => issue.input === undefined 
            ? "Field 'description' is required." 
            : "Field 'description' expects a string, which it was not given."
        })
        .min(5, {
            message: "Description must be at least 5 characters.",
        })
        .max(500, {
            message: "Description must be no more than 500 characters.",
        }),
    sidebar_content: z
        .string({ error: (issue) => issue.input === undefined 
            ? "Field 'sidebar_content' is required." 
            : "Field 'sidebar_content' expects a string, which it was not given."
        })
        .min(15, { error: "Sidebar content must be at least 15 characters." })
        .max(50000, { error: "Sidebar content must be no more than 50,000 characters." }),
    image_url: z
        .string({ error: (issue) => issue.input === undefined 
            ? "Field 'image_url' is required." 
            : "Field 'image_url' expects a string, which it was not given."
        })
})

async function authPOST(req: Request, ctx: ContextWithAuth) {
    try {
        const body = await req.json();
        if (!body) return NextResponse.json({ response: null, error: "A request body with the required information was not provided." }, { status: 400 });
        
        const { name, description, sidebar_content, image_url } = communityCreateSchema.parse(body);

        if (!ctx.userId) return NextResponse.json({ response: null, error: "UserID was not found. Please retry your request." }, { status: 400 });

        const community = await db.community.create({
            data: {
                name: name.toLowerCase(),
                description: description,
                sidebar_content: sidebar_content,
                image: image_url
            }
        })

        await db.communityModerator.create({
            data: {
                communityID: community.id,
                userID: ctx.userId
            }
        })

        await db.communityMembership.create({
            data: {
                communityId: community.id,
                userId: ctx.userId
            }
        })

        return NextResponse.json({ response: community }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) if (error.code === "P2002") return NextResponse.json({ response: null, error: "A community with this name already exists." }, { status: 409 });
        else if (error instanceof z.ZodError) return HandleZodError(error)

        log({ message: error, type: "error", scope: "API > Community > create" })
        if (error instanceof SyntaxError) return NextResponse.json({ response: null, error: "A syntax error occurred, check that your request body is formatted correctly." }, { status: 400 });

        return NextResponse.json({ response: null, error: "The following error occurred while creating the community: " + error }, { status: 500 });
    }
}

export const POST = withAuth(authPOST, true)