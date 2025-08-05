"use client";

import LoginForm from "@/components/auth/login";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const t = useTranslations("Auth.Login");
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("unauthorized") === "true") toast.error(t("Unauthorized.Title"), { description: t("Unauthorized.Description") });
    }, [searchParams, t]);
    
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
}