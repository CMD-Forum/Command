"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    AlertCircle,
    AlertTriangle,
    BoldIcon,
    Bug,
    ChartPie,
    CircleSmall,
    Code,
    CodeXmlIcon,
    FileCog,
    FlaskConical,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Highlighter,
    Image,
    Info,
    ItalicIcon,
    Link2,
    ListOrdered,
    ListTodo,
    MonitorPlay,
    Strikethrough,
    TextQuoteIcon,
    TriangleAlert,
    Variable
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import ExtendedMarkdown from "../markdown/markdown";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function RichMarkdownEditor({ form, formFieldName }: { form: any, formFieldName: string }) {

    const t = useTranslations("Components.RichMarkdownEditor");

    const updateInput = (text: string, method?: "insert" | "wraparound" | "block-meta") => {
        const textarea = document.querySelector<HTMLTextAreaElement>(`textarea[name="${formFieldName}"]`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = value;
        const selection = currentValue.substring(start, end);

        const isCursorInsideCodeBlock = (text: string, cursorIndex: number): boolean => {
            const beforeCursor = text.slice(0, cursorIndex);
            const matches = beforeCursor.match(/```/g);
            return matches ? matches.length % 2 === 1 : false;
        };

        const insertInCurrentCodeBlock = (
            text: string,
            cursorIndex: number,
            insertText: string
        ): string => {
            const beforeCursor = text.slice(0, cursorIndex);
            const codeBlockStart = beforeCursor.lastIndexOf("```");

            if (codeBlockStart === -1) return text;

            const blockHeaderEnd = text.indexOf("\n", codeBlockStart);
            if (blockHeaderEnd === -1) return text;

            const blockAfterHeader = text.slice(blockHeaderEnd + 1);
            const frontmatterStart = blockAfterHeader.indexOf("---");

            if (frontmatterStart === 0) {
                const frontmatterEnd = blockAfterHeader.indexOf("---", 3);
                if (frontmatterEnd === -1) return text;

                const frontmatterInsertPos = blockHeaderEnd + 1 + 3;
                return (
                    text.slice(0, frontmatterInsertPos) +
                    "\n" + insertText +
                    text.slice(frontmatterInsertPos)
                );
            } else {
                const insertPos = blockHeaderEnd + 1;
                return (
                    text.slice(0, insertPos) +
                    "---\n" + insertText + "\n---\n" +
                    text.slice(insertPos)
                );
            }
        };

        if (method === "wraparound") {
            const before = currentValue.slice(start - text.length, start);
            const after = currentValue.slice(end, end + text.length);

            const isWrapped = (before === text && after === text);

            if (isWrapped) {
                const newValue =
                    currentValue.slice(0, start - text.length) +
                    selection +
                    currentValue.slice(end + text.length);

                form.setValue(formFieldName, newValue);

                requestAnimationFrame(() => {
                    textarea.selectionStart = start - text.length;
                    textarea.selectionEnd = end - text.length;
                    textarea.focus();
                });
            } else {
                const newValue =
                    currentValue.slice(0, start) +
                    text + selection + text +
                    currentValue.slice(end);

                form.setValue(formFieldName, newValue);

                requestAnimationFrame(() => {
                    textarea.selectionStart = start + text.length;
                    textarea.selectionEnd = end + text.length;
                    textarea.focus();
                });
            }
        } else if (method === "block-meta") {
            let newValue = currentValue;

            if (isCursorInsideCodeBlock(currentValue, start)) newValue = insertInCurrentCodeBlock(currentValue, start, text);
            else newValue = currentValue.slice(0, start) + text + currentValue.slice(end);

            form.setValue(formFieldName, newValue);

            requestAnimationFrame(() => {
                const newPos = start + text.length;
                textarea.selectionStart = textarea.selectionEnd = newPos;
                textarea.focus();
            });
        } else {
            const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);
            form.setValue(formFieldName, newValue);

            requestAnimationFrame(() => {
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
                textarea.focus();
            });
        }
    };

    function isCursorInsideCodeBlock(text: string, cursorIndex: number): boolean {
        const upToCursor = text.slice(0, cursorIndex);
        const matches = upToCursor.match(/```/g);
        const count = matches ? matches.length : 0;
        return count % 2 === 1;
    }

    const [isInCodeBlock, setIsInCodeBlock] = useState(false);

    const value = useWatch({
        control: form.control,
        name: formFieldName,
    });

    return (
        <div>
            <div className="bg-card border border-input border-b-0 rounded-sm rounded-b-none !h-[44px] w-full p-1 !flex">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("**", "wraparound")}
                        >
                            <BoldIcon />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Bold")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("*", "wraparound")}
                        >   
                            <ItalicIcon />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Italic")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("~~", "wraparound")}
                        >   
                            <Strikethrough />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Strikethrough")}
                    </TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="!min-h-full !mx-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n#", "insert")}
                        >   
                            <Heading1Icon />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Heading1")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n##", "insert")}
                        >   
                            <Heading2Icon />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Heading2")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n###", "insert")}
                        >   
                            <Heading3Icon />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Heading3")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n####", "insert")}
                        >   
                            <Heading4Icon />
                        </Button>                                        
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Heading4")}
                    </TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="!min-h-full !mx-1" />

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                        >
                            <Link2 />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="leading-none font-medium">{t("Link.LinkTitle")}</h4>
                                <p className="text-muted-foreground text-sm">
                                    {t("Link.LinkDescription")}
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    id="mdeditor-link-input"
                                    placeholder="https://github.com/"
                                    className="col-span-2 h-8"
                                />
                                <Input
                                    id="mdeditor-linktext-input"
                                    placeholder="GitHub"
                                    className="col-span-2 h-8"
                                />
                                <Button
                                    variant="default"
                                    type="button"
                                    onClick={() => {
                                        const link_input = document.getElementById("mdeditor-link-input") as HTMLInputElement | null;
                                        const linktext_input = document.getElementById("mdeditor-linktext-input") as HTMLInputElement | null;

                                        if (!link_input || !linktext_input) return;
                                        if (!link_input.value) { 
                                            link_input.focus()
                                            return;
                                        }
                                        if (!linktext_input.value) { 
                                            link_input.focus()
                                            return;
                                        }

                                        updateInput(`[${linktext_input.value}](${link_input.value})`, "insert");
                                    }}
                                >
                                    {t("Link.LinkTitle")}
                                </Button>
                            </div>
                        </div>                                              
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                        >
                            <Image />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="leading-none font-medium">{t("Image.ImageTitle")}</h4>
                                <p className="text-muted-foreground text-sm">
                                    {t("Image.ImageDescription")}
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    id="mdeditor-image-input"
                                    placeholder="https://imgur.com/imageurl"
                                    className="col-span-2 h-8"
                                />
                                <Input
                                    id="mdeditor-imagetext-input"
                                    placeholder={t("Image.ImageAltPlaceholder")}
                                    className="col-span-2 h-8"
                                />
                                <Button
                                    variant="default"
                                    type="button"
                                    onClick={() => {
                                        console.log("Image insert button clicked"); 
                                        const image_input = document.getElementById("mdeditor-image-input") as HTMLInputElement | null;
                                        const imagetext_input = document.getElementById("mdeditor-imagetext-input") as HTMLInputElement | null;
                                        console.log(image_input?.value, imagetext_input?.value);

                                        if (!image_input || !imagetext_input) return;
                                        if (!image_input.value) { 
                                            image_input.focus()
                                            return;
                                        }
                                        if (!imagetext_input.value) { 
                                            imagetext_input.focus()
                                            return;
                                        }

                                        updateInput(`![${imagetext_input.value}](${image_input.value})`, "insert");
                                    }}
                                >
                                    {t("Image.ImageTitle")}
                                </Button>
                            </div>
                        </div>                                              
                    </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="!min-h-full !mx-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("> ", "insert")}
                        >   
                            <TextQuoteIcon />
                        </Button>                                 
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Blockquote")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n- ", "insert")}
                        >   
                            <CircleSmall />
                        </Button>                                 
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("BulletList")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n1. ", "insert")}
                        >   
                            <ListOrdered />
                        </Button>                                 
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("NumberedList")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n- [ ] Item", "insert")}
                        >   
                            <ListTodo />
                        </Button>                                 
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Checkbox")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("\n$$\n\n$$", "insert")}
                        >   
                            <Variable />
                        </Button>                                 
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Math")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("```mermaid\n\n```", "insert")}
                        >   
                            <ChartPie />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Diagram")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("`", "wraparound")}
                        >   
                            <Code />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("InlineCode")}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            onClick={() => updateInput("```\n\n```", "insert")}
                        >   
                            <CodeXmlIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {t("Codeblock")}
                    </TooltipContent>
                </Tooltip>
                                
                {isInCodeBlock && (
                    <>
                        <Separator orientation="vertical" className="!min-h-full !mx-1" />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                >
                                    <Highlighter />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="leading-none font-medium">{t("Metadata.Highlight")}</h4>
                                        <p className="text-muted-foreground text-sm">
                                            {t("Metadata.HighlightDescription")}
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Input
                                            id="mdeditor-highlight-input"
                                            placeholder="1, 3-5"
                                            className="col-span-2 h-8"
                                        />
                                        <Button
                                            variant="default"
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById("mdeditor-highlight-input") as HTMLInputElement | null;
                                                if (!input) return;
                                                if (!input.value) { 
                                                    input.focus()
                                                    return;
                                                }

                                                updateInput(`highlight: ${input.value}`, "block-meta");
                                            }}
                                        >
                                            {t("Metadata.Highlight")}
                                            <Highlighter />
                                        </Button>
                                    </div>
                                </div>                                              
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                >
                                    <FileCog />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="leading-none font-medium">{t("Metadata.FileInfo")}</h4>
                                        <p className="text-muted-foreground text-sm">
                                            {t("Metadata.FileInfoDescription")}
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Input
                                            id="mdeditor-filename-input"
                                            placeholder={t("Metadata.Filename")}
                                            className="col-span-2 h-8"
                                        />
                                        <Input
                                            id="mdeditor-extension-input"
                                            placeholder={t("Metadata.Extension")}
                                            className="col-span-2 h-8"
                                        />
                                        <Input
                                            id="mdeditor-attribution-input"
                                            placeholder={t("Metadata.Attribution")}
                                            className="col-span-2 h-8"
                                        />
                                        <Input
                                            id="mdeditor-license-input"
                                            placeholder={t("Metadata.License")}
                                            className="col-span-2 h-8"
                                        />
                                        <Button
                                            variant="default"
                                            type="button"
                                            onClick={() => {
                                                const filename_input = document.getElementById("mdeditor-filename-input") as HTMLInputElement | null;
                                                const extension_input = document.getElementById("mdeditor-extension-input") as HTMLInputElement | null;
                                                const attribution_input = document.getElementById("mdeditor-attribution-input") as HTMLInputElement | null;
                                                const license_input = document.getElementById("mdeditor-license-input") as HTMLInputElement | null;

                                                /*if (!filename_input) return;
                                                if (!filename_input.value) { 
                                                    filename_input.focus()
                                                    return;
                                                }*/

                                                if (filename_input?.value) updateInput(`filename: ${filename_input.value}`, "block-meta");
                                                if (extension_input?.value) updateInput(`extension: ${extension_input.value}`, "block-meta");
                                                if (attribution_input?.value) updateInput(`attribution: ${attribution_input.value}`, "block-meta");
                                                if (license_input?.value) updateInput(`license: ${license_input.value}`, "block-meta");
                                            }}
                                        >
                                            {t("Metadata.Edit")}
                                        </Button>
                                    </div>
                                </div>                                              
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                >
                                    <MonitorPlay />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="leading-none font-medium">{t("Metadata.RuntimeInfo")}</h4>
                                        <p className="text-muted-foreground text-sm">
                                            {t("Metadata.RuntimeInfoDescription")}
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Input
                                            id="mdeditor-env-input"
                                            placeholder={t("Metadata.Environment")}
                                            className="col-span-2 h-8"
                                        />
                                        <Input
                                            id="mdeditor-dependency-input"
                                            placeholder={t("Metadata.Dependencies")}
                                            className="col-span-2 h-8"
                                        />
                                        <Button
                                            variant="default"
                                            type="button"
                                            onClick={() => {
                                                const env_input = document.getElementById("mdeditor-env-input") as HTMLInputElement | null;
                                                const dependency_input = document.getElementById("mdeditor-dependency-input") as HTMLInputElement | null;

                                                if (env_input?.value) updateInput(`env: ${env_input.value}`, "block-meta");
                                                if (dependency_input?.value) updateInput(`dependencies: ${dependency_input.value}`, "block-meta");
                                            }}
                                        >
                                            {t("Metadata.Edit")}
                                        </Button>
                                    </div>
                                </div>                                              
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                >
                                    <FlaskConical />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-100">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="leading-none font-medium">{t("Metadata.TestingInfo")}</h4>
                                        <p className="text-muted-foreground text-sm">
                                            {t("Metadata.TestingInfoDescription")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            id="mdeditor-doc-input"
                                            placeholder={t("Metadata.DocumentationURL")}
                                            className="col-span-2 h-8"
                                        />
                                        <div className="flex items-center w-full">
                                            <p className="w-[180px] text-sm text-muted-foreground h-8 px-3 flex items-center border border-input border-r-0 rounded-sm rounded-r-none bg-input">www.codesandbox.io</p>
                                            <Input
                                                id="mdeditor-codesandbox-input"
                                                placeholder={t("Metadata.CodesandboxURL")}
                                                className="rounded-l-none h-8 w-full"
                                            />
                                        </div>
                                        <div className="flex items-center w-full">
                                            <p className="w-[180px] text-sm text-muted-foreground h-8 px-3 flex items-center border border-input border-r-0 rounded-sm rounded-r-none bg-input">www.stackblitz.com</p>
                                            <Input
                                                id="mdeditor-stackblitz-input"
                                                placeholder={t("Metadata.StackblitzURL")}
                                                className="rounded-l-none h-8 w-full"
                                            />
                                        </div>
                                        <Button
                                            variant="default"
                                            type="button"
                                            onClick={() => {
                                                const doc_input = document.getElementById("mdeditor-doc-input") as HTMLInputElement | null;
                                                const codesandbox_input = document.getElementById("mdeditor-codesandbox-input") as HTMLInputElement | null;
                                                const stackblitz_input = document.getElementById("mdeditor-stackblitz-input") as HTMLInputElement | null;

                                                if (doc_input?.value) updateInput(`documentation: ${doc_input.value}`, "block-meta");
                                                if (codesandbox_input?.value) updateInput(`codesandbox: ${codesandbox_input.value}`, "block-meta");
                                                if (stackblitz_input?.value) updateInput(`stackblitz: ${stackblitz_input.value}`, "block-meta");
                                            }}
                                        >
                                            {t("Metadata.Edit")}
                                        </Button>
                                    </div>
                                </div>                                              
                            </PopoverContent>
                        </Popover>


                    </>
                )}
                <Separator orientation="vertical" className="!min-h-full !mx-1" />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                        >
                            <TriangleAlert />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="leading-none font-medium">{t("Alerts.Alerts")}</h4>
                                <p className="text-muted-foreground text-sm">
                                    {t("Alerts.AlertsDescription")}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant={"outline"}
                                    onClick={() => updateInput(`\n\n> [!default]\n[title: Title] [description: Description]`, "insert")}
                                >
                                    <Info />
                                    {t("Alerts.Default")}
                                </Button>

                                <Button
                                    variant={"outline"}
                                    onClick={() => updateInput(`\n\n> [!destructive]\n[title: Title] [description: Description]`, "insert")}
                                    className="!text-destructive"
                                >
                                    <AlertCircle />
                                    {t("Alerts.Destructive")}
                                </Button>

                                <Button
                                    variant={"outline"}
                                    onClick={() => updateInput(`\n\n> [!bug]\n[title: Title] [description: Description]`, "insert")}
                                    className="!text-destructive"
                                >
                                    <Bug />
                                    {t("Alerts.Bug")}
                                </Button>

                                <Button
                                    variant={"outline"}
                                    onClick={() => updateInput(`\n\n> [!warning]\n[title: Title] [description: Description]`, "insert")}
                                    className="!text-orange-300"
                                >
                                    <AlertTriangle />
                                    {t("Alerts.Warning")}
                                </Button>
                            </div>
                        </div>                                              
                    </PopoverContent>
                </Popover>

            </div>
                <ResizablePanelGroup direction="horizontal" className="border border-input w-full h-fit min-h-[200px] rounded-lg rounded-t-none">
                    <ResizablePanel defaultSize={50}>
                        <FormField
                            control={form.control}
                            name={formFieldName}
                            render={({ field }) => (
                                <FormItem className="!h-full">
                                    <FormControl className="!h-full">
                                        <Textarea 
                                            className="!rounded-t-none !h-full !border-none" 
                                            {...field} 
                                            onSelect={(e) => {
                                                const textarea = e.currentTarget;
                                                const position = textarea.selectionStart;

                                                const isInCodeBlock = isCursorInsideCodeBlock(textarea.value, position);
                                                setIsInCodeBlock(isInCodeBlock);
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                        {!value
                        ? 
                            <div className="w-full h-full flex items-center justify-center px-8">
                                <p className="text-muted-foreground text-sm">{t("PreviewPlaceholder")}</p>
                            </div>
                        : 
                            <div className="prose p-6">
                                <ExtendedMarkdown content={value} />
                            </div>
                        }
                    </ResizablePanel>
                </ResizablePanelGroup>
        </div>
    );
}