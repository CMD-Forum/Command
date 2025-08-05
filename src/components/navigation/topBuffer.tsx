"use client";

// I know this is an absolutely stupid way to do this, but I'm not sure how else to do it.

import { usePathname } from "next/navigation";

export default function TopBuffer() {
    const PATHNAME = usePathname();

    if (PATHNAME !== "/login" && PATHNAME !== "/signup") return <div className="w-full top-0 left-0 bg-transparent pt-[60px]" />
}