"use client"

import { log } from "@/lib/utils";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import React, {
    forwardRef,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import Image from "../misc/image";

export type ButtonTypes = "Primary" | "Secondary" | "Destructive" | "Ghost"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	/** The type of button. */
	variant?: ButtonTypes;
	/** Optional classes to pass alongside the existing classes. */
	className?: string;
	/** Set to `true` to make the button circular. Try to avoid using with text, as it looks odd. */
	circular?: boolean;
	/** Set to `true` to make the button square. Useful when there's only an icon. */
	square?: boolean;
	/** Event handler that fires when the button is clicked. */
	onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void;
	/** Set to `true` to disable the button. */
	disabled?: boolean;
	/** Optional icon to pass to the button, can be any valid React component. Size automatically set to `16x16px`. */
	icon?: React.ReactElement | null;
	/** Same as icon, but at the end of the button. */
	endIcon?: React.ReactElement | null;
	/** Set to `true` to give this the HTML button type of `submit`. This will make the button submit forms. */
	submitBtn?: boolean;
	/** Set to `true` to make the button disabled and for a loading spinner to appear. */
	loading?: boolean;
	/** Text to show when `loading` is true. */
	loadingText?: string;
	/** Set to `true` to make the button take up the full width of its container. */
	fullWidth?: boolean;
	/** Set to `true` to hide the buttons children when screen width is less than 768px. */
	hideTextOnMobile?: boolean;
	/** Should only be used by other components that modify the button style in some way. Suppresses all warnings related to the variant prop. */
	suppressVariantWarning?: boolean;
	/** Set to `true` to ignore all predefined padding. Useful when using the button as a base for a custom component. */
	ignorePadding?: boolean;
}

export interface ButtonLinkProps extends LinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
	children?: React.ReactNode;
	variant?: ButtonTypes;
	className?: string;
	circular?: boolean;
	square?: boolean;
	onClick?: (_event: React.MouseEvent<HTMLAnchorElement>) => void;
	icon?: React.ReactElement | null;
	endIcon?: React.ReactElement | null;
	fullWidth?: boolean;
	hideTextOnMobile?: boolean;
}

/**
 * Primary UI component for user interaction.
 */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
	children,
	variant = "Primary", 
	className = "",
	circular = false,
	square = false,
	onClick,
	loading,
	loadingText,
	disabled = loading,
	icon,
	endIcon,
	submitBtn = false,
	fullWidth,
	hideTextOnMobile = false,
	suppressVariantWarning,
	ignorePadding,
	...rest
}, ref) => {
	const MISSING_VARIANT_WARN_LOGGED = useRef(false);

  	if (loading) if (variant === "Ghost") { variant = "Ghost" } else { variant = "Secondary" } // Make all buttons (except ghost ones) to be secondary buttons, as ghost buttons should always remain transparent unless hovered or focused.
	
	useEffect(() => {
		if (!variant && !MISSING_VARIANT_WARN_LOGGED.current && !suppressVariantWarning) {
			MISSING_VARIANT_WARN_LOGGED.current = true;
			log({ type: "warning", message: "One of your buttons is missing the variant prop! It will be rendered as a primary button, but you should always specify the prop. Do not rely on this behaviour.", scope: "button.tsx" });
		}		
	}, [suppressVariantWarning, variant]);

	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const updateScreenWidth = () => {
			  	setIsMobile(window.innerWidth < 768);
			};
	  
			updateScreenWidth();
			window.addEventListener("resize", updateScreenWidth);
	  
			return () => {
			  	window.removeEventListener("resize", updateScreenWidth);
			};
		}
	}, []);
  
	if (isMobile === null) return null;
  
	const IS_SQUARE = !children && icon || (hideTextOnMobile && isMobile);
  
	const BTN_CLASSES = clsx(
		`btn${variant}`,
		fullWidth ? "!w-full !justify-center" : "",
		circular ? "!rounded-sm-full aspect-square" : "",
		(square || IS_SQUARE) && !ignorePadding ? `!px-[8px]` : "",
		"relative",
		"overflow-hidden",
		"hover:cursor-pointer",
		className,
	);

	const SPINNER_CLASSES = clsx(
		"spinner !w-4 !h-4 animate-spin text-black",
		icon && !children ? "" : "mr-1"
	);

	return (
		<button
			ref={ref}
			className={BTN_CLASSES}
			onClick={onClick}
			disabled={disabled}
			type={`${submitBtn ? "submit" : "button"}`}
			role="button"
			{...rest}
		>
			{ !loading && icon && React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: string }>>, {
				// TO-DO: Fix this
				// @ts-expect-error: Will have to fix this
				className: clsx("w-4 h-4", variant === "Primary" && "text-black", icon.props?.className)
			})}
			{ loading && variant === "Primary" ? <div className="w-4 h-4 flex items-center !justify-center"><Image src={"/LoadingSpinnerBlack.svg"} width={512} height={512} alt="Loading..." className={SPINNER_CLASSES} /></div> : null}
			{ loading && variant !== "Primary" ? <div className="w-4 h-4 flex items-center !justify-center"><Image src={"/LoadingSpinner.svg"} width={512} height={512} alt="Loading..." className={SPINNER_CLASSES} /></div> : null}
			{ loading ? loadingText || ((isMobile && hideTextOnMobile) ? null : children) : ((isMobile && hideTextOnMobile) ? null : children) }
			{ !loading && endIcon && React.isValidElement(endIcon) && React.cloneElement(endIcon as ReactElement<Partial<{ className: string }>>, {
				// TO-DO: Fix this
				// @ts-expect-error: Will have to fix this				
				className: clsx("w-4 h-4", variant === "Primary" && "text-black", endIcon.props?.className)
			})}
		</button>
	)
})
Button.displayName = "Button";

export default Button;

/**
 * ## ButtonLink
 * ---
 * @param children  Children of the button. Designed for **text** to be passed.
 * @param type      *Defaults to Primary*. Type of the button. Takes `Primary`, `Secondary` or `Destructive`.
 * @param className *Optional*. Pass any desired classes, however note that consistency should be upheld unless absolutely neccessary.
 * @param circular  *Defaults to False*. Whether the button is circular shaped. Intended for icon buttons. *Note that this changes the padding to maintain a square aspect ratio.*
 * @param onClick   *Optional*. Pass the function you wish to be executed on click.
 * @param href      Where to link to.
 * @param icon      *Optional*. Pass an icon if desired. *Note the icon"s width and height will be changed to 20px x 20px.*
 * @example
 * <ButtonLink href="/" type="Primary">Return Home</ButtonLink>
 */

export function ButtonLink({ 
	children, 
	variant = "Primary", 
	className = "",
	circular = false,
	square = false,
	href,
	icon,
	fullWidth,
	hideTextOnMobile = false,
	...rest
}: ButtonLinkProps) {
	const BUTTON_REF = useRef<HTMLAnchorElement>(null);
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
		  const updateScreenWidth = () => {
			setIsMobile(window.innerWidth < 768);
		  };
	
		  updateScreenWidth();
		  window.addEventListener("resize", updateScreenWidth);
	
		  return () => {
			window.removeEventListener("resize", updateScreenWidth);
		  };
		}
	}, []);

	if (isMobile === null) return null;

	const IS_SQUARE = !children && icon || (hideTextOnMobile && isMobile);

	const BTN_CLASSES = [
		`btn${variant}`,
		fullWidth ? "!w-full !justify-center" : "",
		circular ? "!rounded-sm-full aspect-square" : "",
		square || IS_SQUARE ? "!px-[9px]" : "",
		"gap-2",
		"relative",
		"overflow-hidden",
		className,
	]
	.filter(Boolean)
	.join(" ");

	return (
		<Link
			ref={BUTTON_REF}
			href={href}
			className={BTN_CLASSES}
			role="link"
			{...rest}
		>
			{icon && React.isValidElement(icon) && React.cloneElement(icon as ReactElement<Partial<{ className: boolean }>>, {
				// TO-DO: Fix this
				// @ts-expect-error: Same issue as above.
				className: `w-4 h-4 ${variant === "Primary" && "text-black"} ${icon.props?.className || ""}`,
				// @ts-expect-error: Thought I'd fixed this, apparently I didn't.
				...icon.props
			})}
			{hideTextOnMobile && isMobile ? null : children}
		</Link>
	)
}