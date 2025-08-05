"use client";

import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function DeleteAccountCard() {

    const t = useTranslations("Settings");
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const DELETE_ACCOUNT_SCHEMA = z.object({
        password: z.string().min(1, t("DeleteAccountDialog.PasswordRequired")),
        confirm_password: z.string().min(1, t("DeleteAccountDialog.PasswordConfirmationRequired"))
    })

    const FORM = useForm<z.infer<typeof DELETE_ACCOUNT_SCHEMA>>({
        resolver: zodResolver(DELETE_ACCOUNT_SCHEMA),
        defaultValues: {
            password: "",
            confirm_password: "",
        },
    });

    const OnSubmit = async (values: z.infer<typeof DELETE_ACCOUNT_SCHEMA>) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log("Deleted account");
            setIsLoading(false);
        }, 5000);
    };
    
    return (
        <Card className="!pb-0 !max-w-[1200px] !border-red-400/50 !bg-red-400/20">
            <CardHeader>
                <CardTitle>{t("DeleteAccount")}</CardTitle>
                <CardDescription>{t("DeleteAccountDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="!bg-transparent !border-t !border-red-400/50 !pt-3 !pb-3 !w-full !flex">
                <div className="ml-auto" />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">{t("Delete")}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("DeleteAccountDialog.Title")}</DialogTitle>
                            {/*<DialogDescription>{t("DeleteAccountDialog.Description")}</DialogDescription>*/}
                        </DialogHeader>
                        <Form {...FORM}>
                            <form onSubmit={FORM.handleSubmit(OnSubmit)}>
                                <div className="w-full space-y-4 mb-4">
                                    <FormField
                                        control={FORM.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>{t("Password")}</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input className="w-full" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={FORM.control}
                                        name="confirm_password"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>{t("ConfirmPassword")}</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input className="w-full" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    {t("PasswordDescription")}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose><Button variant="outline">{t("Cancel")}</Button></DialogClose>
                                    <Button type="submit" variant="destructive" loading={isLoading}>{t("DeleteAccount")}</Button>
                                </DialogFooter>                                
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

            </CardContent>
        </Card>
    );
}