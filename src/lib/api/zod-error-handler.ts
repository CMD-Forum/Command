import { NextResponse } from "next/server";
import { ZodError } from "zod/v4";

export default function HandleZodError(error: ZodError) {
    const errors = error.issues.map((issue) => {
        return {
            code: issue.code,
            field: issue.path.join("."),
            message: issue.message,
        };
    });
    
    return NextResponse.json({ 
        response: null,
        error: "The following validation error(s) occurred.",
        validation_errors: errors
    }, { status: 400 });
}