"use client";

import { useState } from "react";


import { useTranslations } from "next-intl";
import { z } from "zod";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import GithubLoginButton from "./oauth/github_login_button";

export default function SignupForm() {

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pending, setPending] = useState(false);
    const t = useTranslations("Auth.Signup");

    const SCHEMA = z.object({
        username: z
            .string()
            .min(2, t("Error.Form.UsernameTooShort"))
            .max(20, t("Error.Form.UsernameTooLong")),
        password: z
            .string()
            .min(2 , t("Error.Form.PasswordTooShort")),
        email: z
            .string()
            .email(t("Error.Form.InvalidEmail"))
    })

    const form = useForm<z.infer<typeof SCHEMA>>({
        resolver: zodResolver(SCHEMA),
        defaultValues: {
            username: "",
            password: "",
            email: ""
        },
    })

    const handleSubmit = async (values: z.infer<typeof SCHEMA>) => {
        setErrors({});

        const { data, error } = await authClient.signUp.email({
            email: values.email,
            username: values.username,
            name: values.username,
            password: values.password,
            callbackURL: "/"
        }, {
            onRequest: (ctx) => {
                setPending(true);
            },
            onSuccess: (ctx) => {
                toast.success(t("Success.Title"));
                form.reset();
                setPending(false);
            },
            onError: (ctx) => {
                toast.error(t("Error.Generic.Title"), {
                    description: ctx.error.message,
                });
                // console.log(ctx.error);
                setPending(false);
            },
        });
    };

    return (
        <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{t("Signup")}</CardTitle>
                        <CardDescription>{t("SignupSubtitle")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("Username")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("Email")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("Password")}</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <SubmitButton />
                                
                                <Dialog>
                                    <DialogTrigger>
                                        <Button variant="outline" className="w-full" type="button">
                                            <Github className="w-4 h-4 !text-foreground" />
                                            {t("LoginWithGitHub.Title")}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{t("LoginWithGitHub.Title")}</DialogTitle>
                                            <DialogDescription>{t("LoginWithGitHub.Subtitle")}</DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild><Button variant="outline">{t("LoginWithGitHub.CloseButton")}</Button></DialogClose>
                                            <GithubLoginButton text={t("LoginWithGitHub.Title")} variant="default" />
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </form>
                            
                            <div className="mt-4 text-center text-sm">
                                {t("HaveAccount")}{" "}
                                <a href="/login" className="underline underline-offset-4">
                                    {t("Login")}
                                </a>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
        </div>
    );
}

function SubmitButton({ pending }: { pending?: boolean }) {
    const t = useTranslations("Auth.Signup");

    return (
        <Button 
            variant="default" 
            disabled={pending}
            type="submit" 
            className="!w-full mt-2" 
            loading={pending}
        >
            {pending ? t("SigningUp"): t("Signup")}
        </Button>
    );
}