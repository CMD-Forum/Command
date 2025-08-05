"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export default function Logout({
    text,
    variant,
    className,
    icon
} : {
    text?: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    className?: string;
    icon?: React.ReactNode;
}) {

    const t = useTranslations("Auth");
    const router = useRouter();

    return (
        <form action={async () => { 
            await authClient.signOut(); 
            router.push("/");
        }}>
            <Button 
                type="submit" 
                variant={variant} 
                className={className}
            >
                { icon && icon }
                {text || t("Logout")}
            </Button>
        </form>        
    );
}