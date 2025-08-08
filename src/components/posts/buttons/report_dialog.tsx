"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { report } from "@/lib/actions/posts/report";
import { ReportSubject } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { REPORT_FORM_SCHEMA } from "@/lib/schemas";
import clsx from "clsx";

export default function ReportDialog({ 
    subject,
    subjectID,
    reporterID,
    open,
    setOpen,
}: { 
    subject: ReportSubject,
    subjectID: string;
    reporterID?: string | undefined;
    open: boolean,
    setOpen: (_arg0: boolean) => void,
}) {

    const t = useTranslations("Components.Post.ReportButton");
    
    const { executeAsync, result } = useAction(report);

    const form = useForm<z.infer<typeof REPORT_FORM_SCHEMA>>({
        resolver: zodResolver(REPORT_FORM_SCHEMA),
        defaultValues: {
            subject: subject,
            subjectID: subjectID,
            reporterID: reporterID,
            reason: "",
            other_information: "",
        },
    })

    async function onSubmit(values: z.infer<typeof REPORT_FORM_SCHEMA>) {
        const RESULT = await executeAsync({
            subject: values.subject,
            subjectID: values.subjectID,
            reporterID: values.reporterID,
            reason: values.reason,
            other_information: values.other_information,
        });

        if (RESULT) {
            setOpen(false);
            toast.promise(Promise.resolve(RESULT), {
                loading: t("Toast.Reporting"),
                success: t("Toast.ReportSucceeded"),
                error: t("Toast.ReportFailed"),
            });
        } else {
            toast.error(t("Toast.GenericError"))
        }
    }

    const isMobile = useIsMobile();

    function ReportForm({ className }: { className?: string }) {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={clsx(`space-y-4`, className)}>
                    <FormField
                        control={form.control}
                        name="other_information"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("OtherInformation")} </FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                    {t("OtherInformationDescription")} 
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("Reason")}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t("ReasonPlaceholder")} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Harassment">{t("Reasons.Harassment")}</SelectItem>
                                        <SelectItem value="IllegalContent">{t("Reasons.IllegalContent")}</SelectItem>
                                        <SelectItem value="Spam">{t("Reasons.Spam")}</SelectItem>
                                        <SelectItem value="SelfHarm">{t("Reasons.SelfHarm")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">{t("Cancel")}</Button></DialogClose>
                        <Button variant="default">{t("Report")}</Button>
                    </DialogFooter>
                </form>
            </Form>
        );
    }

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{t("Report")}</DrawerTitle>
                        <DrawerDescription>{t("Subtitle")}</DrawerDescription>
                    </DrawerHeader>
                    <ReportForm className="px-4" />
                    <div className="mt-4" />
                </DrawerContent>
            </Drawer>
        )
    } else return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Report")}</DialogTitle>
                    <DialogDescription>{t("Subtitle")}</DialogDescription>
                </DialogHeader>
                <ReportForm />
            </DialogContent>
        </Dialog>        
    )
}