"use client";

import { ListError } from "@/components/misc/listError"
 
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <ListError title="Sorry, Command failed to load." subtitle={process.env.NODE_ENV === "development" ? `Digest: ${error.digest}` : "Unrecoverable error has occurred."} reloadButton={true} reloadFunction={() => reset()} />
            </body>
        </html>
    )
}