import { Metadata } from "next";

import SignupForm from "@/components/auth/signup";
import { useTranslations } from "next-intl";
 
export const metadata: Metadata = {
  title: "Signup",
};

export default function SignupPage() {
    const t = useTranslations("Auth.Login");
    
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    );
}