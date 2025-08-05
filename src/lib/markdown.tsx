import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Separator } from "@/components/ui/separator";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function ExtendedMarkdownOld({ children }: { children: string }) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]} 
            components={{
                /*a(props) {
                    const {node, ...rest} = props
                    return <a {...rest} className={`${props.className} !text-foreground hover:!underline`}>{props.children}</a>
                },*/
                table(props) {
                    return (
                        <div className="w-full overflow-auto">
                            <Table className="w-full border border-border">
                                {props.children}
                            </Table>
                        </div>
                    );
                },
                thead(props) {
                    return <TableHeader className="bg-muted">{props.children}</TableHeader>;
                },
                tr(props) {
                    return <TableRow className="hover:bg-muted/50">{props.children}</TableRow>;
                },
                th(props) {
                    return <TableHead className="p-3 font-medium text-left border border-border">{props.children}</TableHead>;
                },
                tbody(props) {
                    return <TableBody>{props.children}</TableBody>;
                },
                td(props) {
                    return <TableCell className="p-3 border border-border">{props.children}</TableCell>;
                },
                /*blockquote(props) {
                    return (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                            {props.children}
                        </blockquote>
                    );
                },*/
                hr(props) {
                    const {node, ...rest} = props
                    return <Separator {...rest} className={`${props.className} my-4`} />
                },
                ul(props) {
                    return <ul {...props} className="list-disc pl-6 space-y-1 mb-1">{props.children}</ul>;
                },
                ol(props) {
                    return <ol {...props} className="list-decimal pl-6 space-y-1 mb-1">{props.children}</ol>;
                },
                li(props) {
                    return <li {...props} className="ml-2">{props.children}</li>;
                },
                code({ className, children, ...rest }) {
                    const MATCH = /language-(\w+)/.exec(className || "");
                    return MATCH ? (
                        <SyntaxHighlighter
                            {...(rest as any)}
                            style={oneDark}
                            language={MATCH[1]}
                            PreTag="div"
                            customStyle={{
                                borderRadius: "0.5rem",
                                padding: "1rem",
                                fontSize: "0.875rem",
                                backgroundColor: "var(--background)"
                            }}
                            lineProps={(lineNumber: number) => ({
                                style: {
                                    backgroundColor: "var(--background)",
                                },
                            })}
                        >
                            {String(children).trim()}
                        </SyntaxHighlighter>
                    ) : (
                        <code {...rest} className="bg-background px-1 py-1 rounded-sm">
                            {children}
                        </code>
                    );
                },
            }}
        >
            {children}
        </Markdown>
    );
}