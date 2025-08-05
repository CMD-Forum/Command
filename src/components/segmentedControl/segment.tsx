import { log } from "@/lib/utils";
import clsx from "clsx";
import { cloneElement, isValidElement } from "react";

export default function Segment({
    label,
    icon,
    index,
    activeIndex,
    ariaLabel,
    small,
    onClick
}: {
    label?: string | React.ReactElement;
    icon?: React.ReactElement;
    index?: number;
    activeIndex?: number;
    ariaLabel: string;
    small?: boolean;
    // eslint-disable-next-line no-unused-vars
    onClick?: (index: number) => void;
}) {

    if (!onClick) {
        log({ type: "warning", message: "Prop 'onClick' is not defined.", scope: "segment.tsx > prop: onClick" });
        return; 
    }

    const IS_ACTIVE = index === activeIndex;

    const BTN_CLASSES = clsx(
        "btnGhost items-center justify-center cursor-pointer",
        !label && `!p-1 ${small ? "!w-[24px]" : "!w-[30px]"}`,
        IS_ACTIVE && "!text-white !bg-border",
        small ? "!px-1 !h-[24px] !rounded-sm" : "!h-[30px]"
    );

    return (
        <button className={BTN_CLASSES} onClick={() => onClick(index || -1)} aria-label={ariaLabel}>
            {isValidElement(icon) && cloneElement(icon as React.ReactElement<Partial<{ className: string }>>, {
                // @ts-expect-error: Don't know how to fix this, but since I'm checking for className it should be fine.
                // Then again, the user always manages to break stuff.
                className: clsx("!w-4 !h-4", icon.props.className),
            })}
            {label}
        </button>
    );
}

Segment.displayName = "Segment";