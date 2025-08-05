"use server";

import { db } from "@/lib/db";
// import { logMessage } from "@/lib/utils";

export default async function searchUsers(prevState: unknown, formData: FormData) {
    const SEARCH_TERM = formData.get("searchTerm")?.toString() || "";
    // const SORT = formData.get("sort")?.toString() || "asc";
    const PAGE = parseInt(formData.get("page")?.toString() || "0") || 0;

    // logMessage("search users: " + searchTerm);
    // await new Promise(resolve => setTimeout(resolve, 15000));

    try {
        const RESULT = await db.$queryRaw`
            SELECT username, description, image, public,
                "searchIdx"::TEXT AS "searchIdx"
            FROM "User"
            WHERE 
                to_tsvector('english', 
                    COALESCE("username", '') || ' ' || 
                    COALESCE("description", '') || ' ' ||
                )
                @@ to_tsquery('english', ${SEARCH_TERM} || ':*')
            OFFSET ${PAGE * 10} LIMIT 10;
        `;

        return {
            RESULT,
            ERROR: ""
        };        
    } catch (error) {
        return {
            RESULT: [],
            ERROR: process.env.NODE_ENV === "development" ? error : "Sorry, an error occurred."
        }
    }
}