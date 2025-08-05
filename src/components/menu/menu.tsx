"use client";

import { authClient } from "@/lib/auth/auth-client";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingNode,
    offset,
    Placement,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useFloatingNodeId,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import clsx from "clsx";
import { AnimatePresence, cubicBezier } from "motion/react";
import * as m from "motion/react-m";
import type { Route } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, {
    MouseEventHandler,
    ReactElement,
    use,
    useEffect,
    useState
} from "react";
import Button from "../button/button";
import Dialog, {
    DialogButtonContainer,
    DialogCloseButton,
    DialogContent,
    DialogTrigger
} from "../dialog/dialog";
import Typography from "../misc/typography";
import MenuContext from "./menuContext";

/**
 * ## Menu
 * ---
 * @param defaultPlacement Where the menu is aligned to the button.
 * @param trigger The component that triggers the menu.
 * @param children Children to be passed.
 * @param className Optional, className(s) to be passed.
 * @example
 *  <Menu
        trigger={<button className="navlink !px-2">Menu</button>}
    >
        <MenuLink text={"Item a"} icon={null} link={`/example-a`} />
        <MenuLink text={"Item b"} icon={null} link={`/example-b`} />
        <hr className="mt-1 !mb-1"/>
        <MenuLink text={"Item c"} icon={null} link={`/example-c`} />
    </Menu> 
 */

export default function Menu({
    children,
    defaultPlacement = "bottom-end"
}:{
    children: React.ReactNode
    defaultPlacement?: Placement,
}) {
    const [open, setIsOpen] = useState<boolean>(false);

    const NODE_ID = useFloatingNodeId();
    const {refs, floatingStyles, context} = useFloating({
        nodeId: NODE_ID,
        open: open,
        onOpenChange: setIsOpen,
        middleware: [shift(), flip(), offset(8)],
        whileElementsMounted: autoUpdate,
        placement: defaultPlacement,
    });

    const CLICK = useClick(context);
    const DISMISS = useDismiss(context);
    const ROLE = useRole(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([
      CLICK,
      DISMISS,
      ROLE,
    ]);
    const EASING = cubicBezier(0,0,0,1);

    return (
        <MenuContext.Provider value={{ open, setIsOpen, refs, floatingStyles, context, getReferenceProps, getFloatingProps, easing: EASING }}>
            <FloatingNode id={NODE_ID}>
                { children }    
            </FloatingNode>
        </MenuContext.Provider>
    );
}

export function MenuContent({ 
    children,
    className,
}: { 
    children: React.ReactNode,
    className?: string,
}) {
    const CONTEXT = use(MenuContext);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                CONTEXT.setIsOpen(false);
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
    
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [CONTEXT])

    function mapPlacementToOrigin(placement: Placement) {
        switch (placement) {
          case "top":
            return { originX: "center", originY: "bottom" };
          case "top-start":
            return { originX: "left", originY: "bottom" };
          case "top-end":
            return { originX: "right", originY: "bottom" };
          case "bottom":
            return { originX: "center", originY: "top" };
          case "bottom-start":
            return { originX: "left", originY: "top" };
          case "bottom-end":
            return { originX: "right", originY: "top" };
          case "left":
            return { originX: "right", originY: "center" };
          case "left-start":
            return { originX: "right", originY: "top" };
          case "left-end":
            return { originX: "right", originY: "bottom" };
          case "right":
            return { originX: "left", originY: "center" };
          case "right-start":
            return { originX: "left", originY: "top" };
          case "right-end":
            return { originX: "left", originY: "bottom" };
          default:
            throw new Error(`Unsupported placement: ${placement}`);
        }
    }

    return (
        <>
            <FloatingFocusManager context={CONTEXT.context} modal={false}>
                <AnimatePresence>
                    {CONTEXT.open && <div
                        className="z-[999999] !max-w-fit !min-w-[248px] !p-0"
                        ref={CONTEXT.refs.setFloating}
                        style={CONTEXT.floatingStyles}
                        {...CONTEXT.getFloatingProps()}
                    >               
                        <m.div
                            className={`MenuContent focus-within ${className ? className : ""}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ ease: "easeInOut", duration: 0.1 }}
                            style={mapPlacementToOrigin(CONTEXT.context.placement)}
                            tabIndex={0}
                        >
                            { children }
                        </m.div>
                    </div>}
                </AnimatePresence>
            </FloatingFocusManager>
        </>
    );
}

Menu.Content = MenuContent

/**Menu Link
 * Menu item that"s a NextJS link component.
 * @param text The label of the link, appears beside the icon if given.
 * @param [icon]
 */

export const MenuLink = <T extends string>({ 
    children, 
    icon, 
    link, 
    endIcon,
    shortcut
}: { 
    children: React.ReactElement | string;
    icon?: React.ReactElement | null;
    link: Route<T> | URL;
    endIcon?: React.ReactElement | null;
    shortcut?: React.ReactElement | string;
}) => {
    return (
        <Link 
            href={link} 
            className="flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within"
        >
            <div className="flex gap-2 items-center justify-center w-fit">
                {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<Partial<{ className: string }>>, {
                    // @ts-expect-error: Don't know how to fix this, but since I'm checking for className it should be fine.
                    // Then again, the user always manages to break stuff.
                    className: "!w-4 !h-4 " + (icon.props.className || ""),
                })}

                <span className="w-fit text-sm">{children}</span>                
            </div>
            { endIcon && <div className="w-[100px]" /> }
            { endIcon && React.isValidElement(endIcon) && React.cloneElement(endIcon as React.ReactElement<Partial<{ className: string }>>, {
                // @ts-expect-error: Same as above
                className: "!w-4 !h-4 " + (endIcon.props.className || ""),
            })}
            { shortcut && <Typography variant="p" secondary className="!text-xs">{ shortcut }</Typography> }
        </Link>
    );
}

Menu.Link = MenuLink

export const MenuButton = ({ 
    children, 
    icon, 
    endIcon,
    shortcut,
    onClick, 
    destructive,
    className
}: { 
    children: React.ReactElement | string;
    icon?: React.ReactElement | null;
    endIcon?: React.ReactElement | null;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    destructive?: boolean;
    shortcut?: React.ReactElement | string;
    className?: string;
}) => {
    return (
        <button 
            onClick={onClick}
            className={clsx(
                "flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within", 
                destructive && "hover:!text-BtnDestructive",
                className
            )}
        >
            <div className="flex gap-2 items-center justify-center w-fit">
                { icon && React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: string }>>, {
                    className: "!w-4 !h-4",
                })}
                <span className="w-fit text-sm">{children}</span>
            </div>
            { endIcon && React.isValidElement(endIcon) && React.cloneElement(endIcon as ReactElement<Partial<{ className: string }>>, {
                className: "!w-4 !h-4",
            })}
            { shortcut && <Typography variant="p" secondary className="!text-xs">{ shortcut }</Typography> }
        </button>
    );
}

Menu.Button = MenuButton

export const MenuItem = ({ 
    children, 
    icon,
    endIcon,
    shortcut
}: { 
    children: React.ReactElement | string;
    icon?: React.ReactElement | null;
    endIcon?: React.ReactElement | null;
    shortcut?: React.ReactElement | string;
}) => {
    return (
        <div 
            className="flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within"
        >
            <div className="flex gap-2 items-center justify-center w-fit">
                { icon && React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: string }>>, {
                    className: "!w-4 !h-4 !rounded-sm",
                })}
                <span className="w-fit text-sm">{children}</span>                
            </div>
            { endIcon && <div className="w-[100px]" /> }
            { endIcon && React.isValidElement(endIcon) && React.cloneElement(endIcon as ReactElement<Partial<{ className: string }>>, {
                className: "!w-4 !h-4 !rounded-sm",
            })}
            { shortcut && <Typography variant="p" secondary className="!text-xs">{ shortcut }</Typography>}
        </div>
    );
}

Menu.Item = MenuItem

export const MenuUser = () => {
    const { data: SESSION } = authClient.useSession();
    
    if (SESSION) {
        return (
            <Link 
                href={`/user/${SESSION.user?.username}`} 
                className="flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within"
            >
                <div className="flex flex-col max-w-48">
                    <span className="text-white !text-[15px]">{SESSION.user?.username}</span>
                    <div className="overflow-hidden text-ellipsis max-w-48">
                        <span className="!text-[13px]">{SESSION.user?.email || null}</span>      
                    </div>                    
                </div>
            </Link>
        );
    }
}

Menu.User = MenuUser

export const MenuShare = ({ title, text, url, icon }: { title: string, text: string, url: string, icon: React.ReactElement }) => {
    
    const t = useTranslations("Components.Post");

    if (navigator.share) {
        return (
            <button 
                onClick={async () => await navigator.share({ title: title, text: text, url: url })}
                className={"flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within"}
            >
                <div className="flex gap-2 items-center justify-center w-fit">
                    { icon && React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: string }>>, {
                        className: "!w-4 !h-4 !rounded-sm",
                    })}

                    <span className="w-fit text-sm">{t("Share.Share")}</span>
                </div>
            </button>
        );        
    } else {
        return (
            <Dialog title={t("Share.UnsupportedTitle")} subtitle={t("Share.UnsupportedSubtitle")}>
                <DialogTrigger>
                    <button className="hover:bg-border w-full px-3 py-2 flex gap-2 items-center text-sm group-[hidden]:hidden text-gray-300 hover:text-white rounded cursor-pointer">
                        { React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: string }>>, {
                            className: "w-4 h-4",
                        })}
                        {t("Share.Share")}
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogButtonContainer>
                        <DialogCloseButton><Button variant="Primary">{t("Share.UnsupportedButton")}</Button></DialogCloseButton>    
                    </DialogButtonContainer>
                </DialogContent>
            </Dialog>
        );
    }

}

Menu.Share = MenuShare

export const MenuCustom = ({ children, className }: { children: React.ReactNode | React.ReactElement, className?: string }) => {
    return (
        <div 
            className={`${className ? className : null} flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within`}
        >
            { children }
        </div>
    );
}

Menu.Custom = MenuCustom

export function MenuTrigger({
    children 
}: { 
    children: React.ReactElement<Partial<{ onClick: (_e: React.MouseEvent) => void, ref: (_node: HTMLElement | null) => void, "data-navlink-open": string }>> & { ref?: React.Ref<HTMLElement> };
}) {
    const CONTEXT = use(MenuContext);
    
    return React.isValidElement(React.Children.only(children as React.ReactElement)) && React.cloneElement(
        React.Children.only(children as ReactElement<Partial<{ onClick: (_e: React.MouseEvent) => void, ref: (_node: HTMLElement | null) => void, "data-navlink-open": string }>>),
        {
            onClick: (e: React.MouseEvent) => {
                CONTEXT.setIsOpen(!CONTEXT.open);
                children.props.onClick?.(e);
            },
            ref: (node: HTMLElement | null) => {
                CONTEXT.refs.setReference(node);
                const CHILD_REF = children.ref;
                
                if (typeof CHILD_REF === "function") {
                    CHILD_REF(node);
                } else if (CHILD_REF && "current" in CHILD_REF) {
                    // eslint-disable-next-line react-compiler/react-compiler
                    (CHILD_REF as React.RefObject<HTMLElement | null>).current = node;
                }
            },
            "data-navlink-open": CONTEXT.open ? "true" : "false",
            ...children.props
        }
    );
}

Menu.Trigger = MenuTrigger

export const MenuFormAction = ({ 
    children, 
    icon, 
    endIcon,
    shortcut,
    onClick, 
    destructive,
    action
}: { 
    children: React.ReactElement | string;
    icon?: React.ReactElement | null;
    endIcon?: React.ReactElement | null;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    destructive?: boolean;
    shortcut?: React.ReactElement | string;
    action: string | ((_formData: FormData) => void) | undefined;
}) => {
    return (
        <form action={action}>
            <button 
                onClick={onClick}
                className={`flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer focus-within ${destructive ? "hover:!text-BtnDestructive" : ""}`}
                type="submit"
            >
                <div className="flex gap-2 items-center justify-center w-fit">
                    { icon && React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: string }>>, {
                        className: "!w-4 !h-4 !rounded-sm",
                    })}
                    <span className="w-fit text-sm">{children}</span>
                </div>
                { endIcon && React.isValidElement(endIcon) && React.cloneElement(endIcon as ReactElement<Partial<{ className: string }>>, {
                    className: "!w-4 !h-4 !rounded-sm",
                })}
                { shortcut && <Typography variant="p" secondary className="!text-xs">{ shortcut }</Typography> }
            </button>
        </form>
    );
}

Menu.FormAction = MenuFormAction