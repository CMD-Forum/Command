"use server";

import { db } from "@/lib/db";

export default async function searchPosts(prevState: unknown, formData: FormData) {
    const SEARCH_TERM = decodeURIComponent(formData.get("searchTerm")?.toString() || "");
    // const SORT = formData.get("sort")?.toString() || "asc";
    const PAGE = parseInt(formData.get("page")?.toString() || "0") || 0;

    // logMessage("search posts: " + searchTerm);
    // await new Promise(resolve => setTimeout(resolve, 15000));

    try {
        const RESULT = await db.$queryRaw`
            SELECT id, title, content, imageurl, imagealt, href, public,
                "searchIdx"::TEXT AS "searchIdx"
            FROM "Post"
            WHERE 
                (
                    to_tsvector('english', 
                        COALESCE("title", '') || ' ' || 
                        COALESCE("content", '') || ' ' || 
                        CASE 
                            WHEN "imagealt" IS NOT NULL THEN "imagealt" 
                            ELSE '' 
                        END || ' ' || 
                        CASE 
                            WHEN "href" IS NOT NULL THEN "href" 
                            ELSE '' 
                        END
                    )
                    @@ plainto_tsquery('english', ${SEARCH_TERM})
                    OR
                    similarity(
                        COALESCE("title", '') || ' ' || 
                        COALESCE("content", '') || ' ' || 
                        CASE 
                            WHEN "imagealt" IS NOT NULL THEN "imagealt" 
                            ELSE '' 
                        END || ' ' || 
                        CASE 
                            WHEN "href" IS NOT NULL THEN "href" 
                            ELSE '' 
                        END,
                        ${SEARCH_TERM}
                    ) > 0.3
                )
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