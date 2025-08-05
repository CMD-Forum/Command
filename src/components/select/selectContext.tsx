import { ContextData, ExtendedElements, ExtendedRefs, FloatingContext, FloatingEvents, ReferenceType } from "@floating-ui/react";
import * as React from "react";
import { ButtonTypes } from "../button/button";

declare const ACTIVE_KEY: unique symbol;
declare const SELECTED_KEY: unique symbol;

declare type ExtendedUserProps = {
    [ACTIVE_KEY]?: boolean;
    [SELECTED_KEY]?: boolean;
};

export interface SelectContextType {
	open: boolean;
	setIsOpen: (_arg0: boolean) => void;
	refs: {    
		reference: React.RefObject<ReferenceType | null>;
		floating: React.RefObject<HTMLElement | null>;
		setReference: (_node: ReferenceType | null) => void;
		setFloating: (_node: HTMLElement | null) => void;
	},
  	floatingStyles: React.CSSProperties;
	context: FloatingContext<ReferenceType>;
	getReferenceProps: (_userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
	getFloatingProps: (_userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
	easing: (_t: number) => number;
	selectedLabel: string | null;
	elementsRef: React.RefObject<(HTMLElement | null)[]>;
	labelsRef: React.RefObject<(string | null)[]>;
	getItemProps: (_userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active"> & ExtendedUserProps) => Record<string, unknown>;
	defaultLabel: string;
	disabled: boolean;
	buttonVariant: ButtonTypes;
	label: string;
	btnClassName: string | undefined;
	activeIndex: number | null;
	selectedIndex: number | null;
	handleSelect: (_index: number | null, _value: string) => void;
	variant?: "Standard" | "Outlined";
	placeholder?: string;
	small?: boolean;
	icon?: React.ReactElement;
}

const SelectContext = React.createContext<SelectContextType>({
	open: false,
	setIsOpen: () => {},
	refs: {
		reference: React.createRef<ReferenceType>(),
		floating: React.createRef<HTMLElement>(),
		setReference: () => {},
		setFloating: () => {},
	},
	floatingStyles: {},
	context: {
		open: false,
		onOpenChange: () => {},
		events: {} as FloatingEvents,
		dataRef: {
			current: React.createRef<ContextData>(),
		},
		nodeId: undefined,
		floatingId: "",
		refs: {} as ExtendedRefs<ReferenceType>,
		elements: {} as ExtendedElements<ReferenceType>,
		placement: "bottom-end",
		strategy: "absolute",
		middlewareData: {},
		x: 0,
		y: 0,
		isPositioned: false,
		update: () => {},
		floatingStyles: {},
	},
	getReferenceProps: () => ({}),
	getFloatingProps: () => ({}),
	easing: (t: number) => t,
	selectedLabel: null,
	// TO-DO: Fix this
	// @ts-expect-error: Will have to fix this
	elementsRef: React.createRef<(HTMLElement | null)[]>(),
	// @ts-expect-error: And this too
	labelsRef: React.createRef<(string | null)[]>(),
	getItemProps: () => ({}),
	defaultLabel: "",
	disabled: false,
	buttonVariant: "Secondary",
	label: "",
	btnClassName: undefined,
	activeIndex: 0,
	selectedIndex: 0,
	handleSelect: () => ({}),
	variant: "Standard",
	placeholder: "",
	small: false,
});

if (process.env.NODE_ENV !== "production") {
  	SelectContext.displayName = "SelectContext";
}

export default SelectContext;