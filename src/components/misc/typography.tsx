import React from "react";

export default function Typography({ 
    children, 
    variant = "h1",
    className,
    secondary = false,
    whiteOnHover = false,
    centered = false,
    error = false,
    success = false,
    htmlFor,
    id,
    Component = variant
}: { 
    children: React.ReactNode;
    variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "label";
    className?: string;
    secondary?: boolean;
    whiteOnHover?: boolean;
    centered?: boolean;
    error?: boolean;
    success?: boolean;
    id?: string;
    htmlFor?: string;
    Component?: React.ElementType;
}) {

    const CLASSES = [
        `${variant}`,
        className ? className : "",
        secondary ? "!text-muted-foreground" : "",
        !secondary && !error && !success ? "!text-foreground" : "",
        error ? "!text-red-300" : "",
        success ? "!text-green-300": "",
        centered ? "text-center" : "",
        whiteOnHover ? "hover:!text-foreground" : "",
        "transition-all"
    ]
    .filter(Boolean)
    .join(" ");

    return (
        <Component 
            id={id}
            htmlFor={htmlFor}
            className={CLASSES}
        >
            {children}
        </Component>
    );
}

export function TypographyMuted({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
      <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
    )
}

export function TypographySmall({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
      <p className={`text-sm font-medium leading-none ${className}`}>{children}</p>
    )
}

export function TypographyLarge({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
      <p className={`text-lg font-semibold ${className}`}>{children}</p>
    )
}

export function TypographyLead({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
      <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
    )
}

export function TypographyInlineCode({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <code className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}>
            {children}
        </code>
    )
}

export function TypographyList({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`}>
            {children}
        </ul>
    )
}

export function TypographyBlockquote({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
            {children}
        </blockquote>
    )
}

export function TypographyP({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
            {children}
        </p>
    )
}

export function TypographyH4({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
            {children}
        </h4>
    )
}

export function TypographyH3({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
            {children}
        </h3>
    )
}

export function TypographyH2({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <h2 className={`scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>
            {children}
        </h2>
    )
}

export function TypographyH1({ children, className } : { children: React.ReactNode, className?: string }) {
    return (
        <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
            {children}
        </h1>
    )
}