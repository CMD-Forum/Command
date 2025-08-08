"use client";


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
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function DeletePostDialog({ 
    postID,
    open,
    setOpen,
}: { 
    postID: string;
    open: boolean,
    setOpen: (_arg0: boolean) => void,
}) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const t = useTranslations("Components.Post.DeleteDialog");

    async function deletePost() {
        /// TBD
        setIsLoading(true);
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                setIsLoading(false);
                resolve(true);
            }, 2000);
        });
    }

    async function onSubmit() {
        setIsLoading(true);
        const result = await deletePost();
        if (result === true) toast.success("Post was successfully deleted.")
        else toast.error("Post failed to delete.")
    }

    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{t("Title")}</DrawerTitle>
                        <DrawerDescription>{t("Subtitle")}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button variant={"destructive"} onClick={async () => onSubmit()} loading={isLoading}>{t("Delete")}</Button>
                        <DrawerClose asChild><Button variant={"outline"}>{t("Cancel")}</Button></DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    } else return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Title")}</DialogTitle>
                    <DialogDescription>{t("Subtitle")}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={"destructive"}>{t("Delete")}</Button>
                    <DialogClose asChild><Button variant={"outline"}>{t("Cancel")}</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>        
    )
}