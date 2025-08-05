import HandleZodError from "@/lib/api/zod-error-handler";
import { log } from "@/lib/utils";
import { NextResponse } from "next/server";
import z from "zod/v4";

export const searchSchema = z.object({
    query: z
        .string({ error: (issue) => issue.input === undefined 
            ? "Field 'name' is required." 
            : "Field 'name' expects a string, which it was not given."
        })
        .min(2, {
            message: "Query must be at least 2 characters.",
        })
        .max(500, {
            message: "Query must be no longer than 500 characters.",
        })
})

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const raw = Object.fromEntries(url.searchParams.entries());
        const { query } = raw;
        
        const { query: result } = searchSchema.parse(query);

        // const within = searchParams.get("within");
        // const tags = searchParams.get("tags")?.split(",") || [];

        return NextResponse.json({ response: result }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) return HandleZodError(error)
        
        log({ message: error, type: "error", scope: "API > Community > create" })
        if (error instanceof SyntaxError) return NextResponse.json({ response: null, error: "A syntax error occurred, check that your request body is formatted correctly." }, { status: 400 });
        
        return NextResponse.json({ response: null, error: "The following error occurred while searching: " + error }, { status: 500 });
    }
}