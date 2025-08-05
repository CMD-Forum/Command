"use client";

import { AlertCircle, AlertTriangle, Bug, Codesandbox, Copy, ExternalLink, Info, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Markdown from "react-markdown";
import { toast } from "sonner";

import { log } from "@/lib/utils";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import remarkCjkFriendly from "remark-cjk-friendly";
import emoji from "remark-emoji";
import { extendedTableHandlers, remarkExtendedTable } from 'remark-extended-table';
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import dynamic from "next/dynamic";

const Alert = dynamic(() => import("@/components/ui/alert").then(mod => mod.Alert), { 
    loading: () => <Skeleton className="h-[68px] w-full rounded-lg mt-4 mb-4" />
});
const AlertDescription = dynamic(() => import("@/components/ui/alert").then(mod => mod.AlertDescription), { 
    loading: () => <Skeleton className="h-[20px] w-full rounded-sm" />
});
const AlertTitle = dynamic(() => import("@/components/ui/alert").then(mod => mod.AlertTitle), { 
    loading: () => <Skeleton className="h-[20px] w-full rounded-sm" />
});

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then(m => m.Light),
  { ssr: false, loading: () => <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground"><LoadingSpinner /></div> }
);

import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

import TrustedDomains from "@/lib/trusted-domains";
import clsx from "clsx";
import React, { Suspense, useState } from "react";
import KBD from "../kbd/kbd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { LoadingSpinner } from "../ui/spinner";
import Mermaid from "./mermaid";

function parseHighlightLines(highlight?: string | number | (string | number)[]): number[] {
    if (highlight == null) return [];

    const lines: number[] = [];

    const addRange = (part: string | number) => {
        if (typeof part === "number") lines.push(part);
        else if (typeof part === "string") {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(Number);
                for (let i = start; i <= end; i++) {
                    lines.push(i);
                }
            } else {
                const maybeNum = parseInt(part.trim(), 10);
                if (!isNaN(maybeNum)) lines.push(maybeNum);
            }
        }
    };

    if (Array.isArray(highlight)) highlight.forEach(addRange);
    else if (typeof highlight === "string") highlight.split(",").forEach(addRange);
    else addRange(highlight);

    return lines;
}

function normalizeUrl(href: string): string {
    if (/^https?:\/\//i.test(href)) return href;
    return `https://${href}`;
}

function extractTextFromReactNode(node: React.ReactNode): string {
    if (typeof node === "string" || typeof node === "number") return node.toString();
    if (Array.isArray(node)) return node.map(extractTextFromReactNode).join("");
    // @ts-ignore
    if (React.isValidElement(node)) return extractTextFromReactNode(node.props.children);
    return "";
}

export default function ExtendedMarkdown({ content }: { content: string }) {

    const t = useTranslations("Components.Markdown");
    const [open, setOpen] = useState<boolean>(false);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    
    return (
        <div>
            <Suspense fallback={<></>}>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogTitle>{t("ExitWarning.Title")}</DialogTitle>
                        <DialogDescription>
                            {t("ExitWarning.Description1")}
                            <br />
                            <span className="text-sm text-foreground break-all">{selectedUrl}</span>
                            <br className="mb-4" />
                            {t("ExitWarning.Description2")}
                        </DialogDescription>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>{t("ExitWarning.Cancel")}</Button>
                            <Button onClick={() => { 
                                if (selectedUrl) {
                                    window.open(selectedUrl || "", "_blank", "noopener,noreferrer");
                                    setOpen(false);
                                }
                            }}>
                                {t("ExitWarning.Continue")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>                
            </Suspense>
            <Markdown
                remarkPlugins={[
                    remarkGfm, 
                    remarkFrontmatter, 
                    remarkMath, 
                    remarkCjkFriendly,
                    remarkExtendedTable,
                    emoji
                ]}
                rehypePlugins={[
                    rehypeSanitize, 
                    rehypeKatex,
                    rehypeAutolinkHeadings
                ]}
                remarkRehypeOptions={{
                    handlers: {
                        ...extendedTableHandlers
                    }
                }}
                components={{
                    code(props) {
                        const { node, ...rest } = props
                        const raw = props.children?.toString() ?? "";

                        const isBlock = node?.tagName === "code" && node.position?.start?.line !== node.position?.end?.line;
                        const isInline = !isBlock;

                        if (isInline) return <KBD>{props.children}</KBD>;

                        const MATCH = /language-(\w+)/.exec(props.className ?? "");
                        if (MATCH && MATCH[1] === "mermaid") return <Mermaid chart={props.children?.toString() || ""} />;;

                        const { data: frontmatter, content: cleanCode } = matter(raw);

                        const filename = frontmatter.filename ?? null;
                        const extension = frontmatter.extension ?? null;
                        const attribution = frontmatter.attribution ?? null;
                        const dependencies = Array.isArray(frontmatter.dependencies)
                            ? frontmatter.dependencies
                            : typeof frontmatter.dependencies === "string"
                            ? frontmatter.dependencies.split(",").map((s: string) => s.trim())
                            : [];

                        const license = frontmatter.license ?? null;
                        const env = frontmatter.env ?? null;
                        const codesandbox = frontmatter.codesandbox ?? null;
                        const stackblitz = frontmatter.stackblitz ?? null;
                        const documentation = frontmatter.documentation ?? null;
                    
                        const highlightLines = parseHighlightLines(frontmatter.highlight);

                        return (
                            <div className="w-full border rounded-sm">
                                <div className="w-full p-2 px-4 border-b flex gap-2 !h-[44px]">
                                    <p className="inter text-muted-foreground">{filename}{extension ? "." + extension : ""}</p>
                                    <div className="w-full" />

                                    {documentation ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant={"outline"} 
                                                    size={"icon_sm"} 
                                                    type="button" 
                                                    onClick={() => {
                                                        setSelectedUrl(documentation);
                                                        setOpen(true);
                                                    }}
                                                >
                                                    <ExternalLink />
                                                </Button>                                            
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {t("ViewDocumentation")}
                                            </TooltipContent>
                                        </Tooltip>                                        
                                    ) : null}                                    

                                    {stackblitz ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant={"outline"} size={"icon_sm"} type="button" asChild>
                                                    <a href={"https://www.stackblitz.com/" + stackblitz}>
                                                        <Zap />
                                                    </a>
                                                </Button>                                            
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {t("OpenInStackblitz")}
                                            </TooltipContent>
                                        </Tooltip>                                        
                                    ) : null}

                                    {codesandbox ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant={"outline"} size={"icon_sm"} type="button" asChild>
                                                    <a href={"https://www.codesandbox.io/" + codesandbox}>
                                                        <Codesandbox />
                                                    </a>
                                                </Button>                                            
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {t("OpenInCodesandbox")}
                                            </TooltipContent>
                                        </Tooltip>                                        
                                    ) : null}

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="icon_sm" 
                                                type="button"
                                                onClick={() => { 
                                                    navigator.clipboard.writeText(cleanCode || "")
                                                    .then(() => {
                                                        toast.success(t("Copied"));
                                                    })
                                                    .catch((err) => {
                                                        toast.error(t("CopyFailed"))
                                                        log({ type: "warning", message: "Failed to copy text to clipboard with the following error: " + err });
                                                    });
                                                }}
                                            >
                                                <Copy />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {t("Copy")}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Suspense fallback={<div className="h-[200px] w-full flex items-center justify-center text-muted-foreground"><LoadingSpinner /></div>}>
                                    <SyntaxHighlighter
                                        {...(rest as any)}
                                        style={vs2015}
                                        language={MATCH ? MATCH[1] : null}
                                        PreTag="div"
                                        customStyle={{
                                            borderRadius: "0.5rem",
                                            padding: "1rem",
                                            fontSize: "0.875rem",
                                            backgroundColor: "var(--background)",
                                            color: "var(--foreground)"
                                        }}
                                        wrapLines
                                        showLineNumbers                                 
                                        lineProps={(lineNumber) => {
                                            const isHighlighted = highlightLines.includes(lineNumber);
                                            return {
                                                style: isHighlighted
                                                ? { backgroundColor: "var(--muted)", borderRadius: "0.25rem" }
                                                : {},
                                            };
                                        }}
                                    >
                                        {cleanCode.trim()}    
                                    </SyntaxHighlighter>                                
                                </Suspense>

                                { attribution || license || dependencies.length > 0 || env ? (
                                    <Accordion type="single" collapsible className="w-full bg-card/50 border-t px-4 rounded-sm rounded-t-none" defaultValue="metadata">
                                        <AccordionItem value="metadata" className="w-full">
                                            <AccordionTrigger className="inter text-muted-foreground">{t("Metadata.Metadata")}</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="border-b mb-4" />

                                                <div className="flex flex-row gap-2 w-full">
                                                    <p className="!mt-0 inter font-semibold text-muted-foreground">{t("Metadata.Author")}:</p>
                                                    <p className="!mt-0 inter">{attribution || "N/A"}</p>
                                                </div>          

                                                <div className="flex flex-row gap-2 w-full">
                                                    <p className="!mt-0 inter font-semibold text-muted-foreground">{t("Metadata.License")}:</p>
                                                    <p className="!mt-0 inter">{license || "N/A"}</p>
                                                </div>

                                                <div className="flex flex-row gap-2 w-full">
                                                    <p className="!mt-0 inter font-semibold text-muted-foreground">{t("Metadata.Dependencies")}:</p>
                                                    <p className="!mt-0 inter">{dependencies.join(", ") || "N/A"}</p>
                                                </div>

                                                <div className="flex flex-row gap-2 w-full">
                                                    <p className="!mt-0 inter font-semibold text-muted-foreground">{t("Metadata.Environment")}:</p>
                                                    <p className="!mt-0 inter">{env || "N/A"}</p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ) : null}
                            </div>
                        );
                    },
                    a(props) {
                        const { node, href, style, ...rest } = props
                        const normalizedHref = href ? normalizeUrl(href) : "";
                        const isTrusted = TrustedDomains.some(domain => normalizedHref.includes(domain));

                        if (isTrusted) {
                            return <a href={href} {...rest} />
                        }

                        return (
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    /*if (isTrusted) {
                                        window.open(normalizedHref || "", "_blank", "noopener,noreferrer");
                                        return;
                                    }*/
                                    if (normalizedHref) {
                                        setSelectedUrl(normalizedHref)
                                        setOpen(true)
                                    }
                                }}
                                style={{
                                    cursor: "pointer"
                                }}
                                {...rest}
                            >
                                {props.children}
                            </a>
                        )
                    },
                    blockquote(props) {
                        const { node, ...rest } = props

                        const raw = extractTextFromReactNode(props.children);

                        const TYPE_MATCH = raw.match(/\[\!([^"\]]+)\]/);
                        const type = TYPE_MATCH?.[1] ?? null;

                        if (!type) return <blockquote {...rest}>{props.children}</blockquote>;

                        const TITLE_MATCH = raw.match(/\[title: ([^"\]]+)\]/);
                        const title = TITLE_MATCH?.[1] ?? null;

                        const DESCRIPTION_MATCH = raw.match(/\[description: ([^"\]]+)\]/);
                        const description = DESCRIPTION_MATCH?.[1] ?? null;

                        const VARIANT_MAP: Record<string, "default" | "destructive"> = {
                            "default": "default",
                            "destructive": "destructive",
                            "bug": "destructive",
                            "warning": "default"
                        }

                        const ICON_MAP = {
                            default: <Info />,
                            destructive: <AlertCircle />,
                            bug: <Bug />,
                            warning: <AlertTriangle />
                        }

                        const variant = VARIANT_MAP[type];
                        // @ts-ignore: It works
                        const icon = ICON_MAP[type];

                        if (!variant || !icon) return <blockquote {...rest}>{props.children}</blockquote>;

                        return (
                            <Alert variant={variant} className={clsx(
                                variant === "destructive" ? "bg-red-500/10 border-red-500/20" : "",
                                type === "warning" ? "bg-orange-500/20 border-orange-500/30 *:!text-orange-300" : "",
                                "mb-4"
                            )}>
                                {icon}
                                <AlertTitle>{title}</AlertTitle>
                                <AlertDescription>{description}</AlertDescription>
                            </Alert>
                        );
                    },
                    img(props) {
                        const { className, ...rest } = props

                        return (
                            <img
                                className={clsx(className, "rounded-lg hover:brightness-75 transition-all")} 
                                onClick={
                                    () => toast.info(t("ImageExpandMessage"))
                                }
                                {...rest}
                            />
                        );
                    }
                }}
            >
                {content}
            </Markdown>
        </div>        
    );
}