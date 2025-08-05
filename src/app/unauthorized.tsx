"use client";

import { useRouter } from "next/navigation";

export default function Unauthorized() {

    const ROUTER = useRouter();
    ROUTER.push("/login?unauthorized=true");

    return (
        <></>
    );
}