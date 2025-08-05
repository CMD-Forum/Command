"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import Button from "../button/button";

export type TabStyle = "filled" | "underlined" | "filled-ghost" | "button-group" | "pills";

export function Tabs({ 
    children, 
    preSelectedTabIndex,
    className,
    style = "filled",
    bottomBorder = style === "underlined" ? true : false,
}: { 
    children: React.ReactElement[];
    preSelectedTabIndex?: number;
    className?: string;
    style?: TabStyle,
    bottomBorder?: boolean;
}) {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(preSelectedTabIndex || 0);
    const TABS_REF = useRef<(HTMLButtonElement | null)[]>([]);
    const [bgPosition, setBgPosition] = useState(0);
    const [underlineTop, setUnderlineTop] = useState(0);
    const [loading, setLoading] = useState(true);

    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowHeight, setWindowHeight] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                setWindowHeight(window.innerHeight);
            };

            window.addEventListener("resize", handleResize);

            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        if (TABS_REF.current[selectedTabIndex]) {
            setBgPosition(TABS_REF.current[selectedTabIndex].offsetLeft);
            setUnderlineTop(TABS_REF.current[selectedTabIndex].offsetTop + TABS_REF.current[selectedTabIndex].offsetHeight - (style === "filled" || style === "filled-ghost" || style === "pills" ? 32 : 1));
            setLoading(false);
        }
    }, [selectedTabIndex, style, windowWidth, windowHeight]);

    // CLSX is now used to cleanup classNames. All the "false" and "undefined" was extremely ugly.
    // - JamsterJava

    const UL_CLASSES = clsx(
        "flex flex-row rounded-sm mb-4",
        style === "button-group" && "p-1 gap-1 !h-[40px] border border-border !w-fit",
        style === "filled" && "bg-grey-one pb-1.5 px-1.5 !w-full pt-1.5",
        style === "filled-ghost" || style === "pills" && "bg-transparent pb-1.5 px-1.5 !w-full pt-1.5",
        bottomBorder === true && "!border-b !border-border !rounded-none",
        className
    );

    return (
        <div className={clsx(style !== "button-group" && "!w-full")}>
            <ul className={UL_CLASSES}>
                {(children as React.ReactElement<{ label: string; icon?: React.ReactElement }>[])
                    .map((item, index) => (
                    <Tab 
                        key={index}
                        label={item.props.label} 
                        icon={item.props.icon}
                        index={index} 
                        isActive={index === selectedTabIndex}
                        setSelectedTab={setSelectedTabIndex}
                        // @ts-expect-error: Don't know what's happening here, but it works.
                        tabRef={(el: HTMLButtonElement | null) => TABS_REF.current[index] = el}
                        style={style}
                    />
                ))}
                {!loading && (
                    <div    
                        className="absolute transition-all"
                        style={{
                            top: `${underlineTop}px`,
                            height: style !== "underlined" ? ( style === "button-group" ? "" : "32px") : "2px",
                            zIndex: 0,
                            borderRadius: style !== "underlined" ? ( style === "button-group" ? "" : ( style === "pills" ? "9999px" : "4px" ) ) : "0px",
                            backgroundColor: style !== "underlined" ? ( style === "button-group" ? "" : "var(--color-border)") : "white",
                            left: `${bgPosition}px`,
                            width: `${TABS_REF.current[selectedTabIndex]?.offsetWidth}px`,
                        }}
                    />
                )}
            </ul>

            {children[selectedTabIndex]}            
        </div>
    );
}

export function Tab({ 
    label, 
    icon,
    endIcon,
    setSelectedTab, 
    index, 
    isActive,
    tabRef,
    className,
    style
}: { 
    label?: string;
    icon?: React.ReactElement;
    endIcon?: React.ReactElement;
    setSelectedTab: (_index: number) => void;
    index: number;
    isActive?: boolean;
    tabRef: React.Ref<HTMLButtonElement>;
    className?: string;
    style: TabStyle;
}) {

    const BTN_CLASSES = clsx(
        style === "button-group" && `btnGhost items-center justify-center ${!label && "!p-1"} ${isActive && "!bg-border"} !h-[30px] !w-[30px] !rounded`,
        style !== "button-group" && "btnGhost cursor-pointer !bg-transparent whitespace-nowrap flex gap-2 hover:!bg-transparent !px-4 !w-full !items-center !justify-center !text-secondary !rounded",
        style === "pills" && "!rounded-full !w-fit !px-3",
        isActive && "!text-white",
        className
    );

    return (
        <li className={clsx("z-[2]", style === "pills" ? "!w-fit" : "!w-full")} key={index}>
            <Button
                variant="Ghost"
                className={BTN_CLASSES}
                onClick={() => setSelectedTab(index)}
                aria-label={`Tab. Label: ${label}`}
                ref={tabRef}
                square={label ? true : false}
                icon={icon}
                endIcon={endIcon}
                ignorePadding
            >
                { label }
            </Button>
        </li>
    );
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const TabContent = ({ label, children, icon, wrapperClassName, className }: { label?: string, children: React.ReactElement | React.ReactElement[], icon?: React.ReactElement, wrapperClassName?: string, className?: string }) => <div className={wrapperClassName}>{children}</div>;