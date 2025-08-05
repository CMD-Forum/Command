import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function GithubLoginButton({ 
    text, 
    variant 
}: { 
    text: string, 
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
}) {

    const signIn = async () => {
        await authClient.signIn.social({
            provider: "github"
        })
    }
    
    return (
        <Button variant={variant} aria-label={text} onClick={signIn}>{text}</Button>
    );
}