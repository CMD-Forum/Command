import clsx from "clsx";
import React from "react";

export default function SegmentedControl({
    children,
    value,
    onChange,
    ariaLabel,
    small = false
}: {
    children: React.ReactElement[];
    value?: number | null;
    // eslint-disable-next-line no-unused-vars
    onChange: (index: number) => void; 
    ariaLabel: string;
    small?: boolean;
}) {
    return (
        <div 
            className={`flex p-1 gap-1 ${small ? "!h-[34px]" : "!h-[40px]"} border border-border !w-fit rounded-sm`}
            role="group"
            aria-label={ariaLabel}
        >
            {children.map((child: React.ReactElement, index: number) => {
                // @ts-expect-error: TO-DO: Fix this
                if (child.type.displayName === "Segment") {
                    // eslint-disable-next-line no-unused-vars
                    if (!React.isValidElement<{ 
                        label?: string;
                        icon?: React.ReactElement;
                        index?: number;
                        activeIndex?: number;
                        setActiveIndex?: (index: number) => void;
                        small?: boolean;
                        className?: string;
                    }>(child)) return null;

                    // eslint-disable-next-line no-unused-vars
                    return React.cloneElement(child as React.ReactElement<Partial<{ 
                        label?: string;
                        icon?: React.ReactElement;
                        index?: number;
                        activeIndex?: number;
                        setActiveIndex?: (index: number) => void;
                        small?: boolean;
                        className?: string;
                    }>>, {
                        key: index,
                        index: index,
                        activeIndex: value ?? -1,
                        onClick: () => onChange(index),
                        small: small,
                        className: clsx(small ? "!p-0.5 !px-0.5" : "p-1", child.props.className),
                        ...(child.props as React.HTMLProps<HTMLElement>)
                    })
                }
                return child;
            })}
        </div>
    );
    
}