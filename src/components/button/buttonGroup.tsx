import React from "react"

/**
 * Group of buttons that are displayed together.
 */

export default function ButtonGroup({
    children,
}: {
    children: React.ReactElement[]
}) {

    return (
        <div className="flex">
            {children.map((child: React.ReactElement, index: number) => {
                // @ts-expect-error: TO-DO: Fix this
                if (child.type === "button" || child.type.displayName === "Button") {
                    if (!React.isValidElement<{ className?: string }>(child)) return null;
                    const ROUNDED = index === 0 ? "!rounded-r-none" : index === children.length - 1 ? "!rounded-l-none !border-l-0" : "!rounded-none !border-l-0"

                    return React.cloneElement(child as React.ReactElement<Partial<{ className: string }>>, {
                        key: index,
                        className: ROUNDED + " " + child.props.className,
                        ...(child.props as React.HTMLProps<HTMLElement>)
                    })
                }
                return child;
            })}
        </div>
    );
    
}