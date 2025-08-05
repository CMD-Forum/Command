import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Share } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ShareButton({ 
    title, 
    text, 
    url,
}: { 
    title: string;
    text: string;
    url: string;
}) {

    const t = useTranslations("Components.Post.Share");

    if (navigator.share) {
        return (
            <Button variant="outline" onClick={async () => await navigator.share({ title: title, text: text, url: url })}>
                <Share />
                {t("Share")}
            </Button>
        );
    } else {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline"><Share />{t("Share")}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("Share")}</DialogTitle>
                        <DialogDescription>{t("ShareDescription")}</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                {t("Link")}
                            </Label>
                            <Input
                                id="link"
                                defaultValue={url}
                                readOnly
                            />
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button type="submit" size="sm" className="px-3">
                                        <span className="sr-only">{t("Copy")}</span>
                                        <Copy />
                                    </Button>                                    
                                </TooltipTrigger>
                                <TooltipContent>{t("Copy")}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">{t("Close")}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>            
        );
    }
}