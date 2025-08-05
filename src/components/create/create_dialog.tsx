"use client";

import { 
    BookText, 
    EthernetPort, 
    Plus 
} from "lucide-react";

import { 
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";

import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function CreateDialog({ text = false }: { text?: boolean }) {

    const t = useTranslations("Components.CreateDialog");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"default"} size={text ? "default" : "icon"}><Plus />{text && t("Create")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Create")}</DialogTitle>
                    <DialogDescription>{t("CreateSubtitle")}</DialogDescription>                    
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild><Button variant={"outline"} asChild><a href="/create/post"><BookText />{t("CreatePost")}</a></Button></DialogClose>
                    <DialogClose asChild><Button variant={"outline"} asChild><a href="/create/community"><EthernetPort />{t("CreateCommunity")}</a></Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}