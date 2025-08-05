import {
	ContextData,
	ExtendedElements,
	ExtendedRefs,
	FloatingContext,
	FloatingEvents,
	ReferenceType
} from "@floating-ui/react";
import * as React from "react";

interface MenuContextType {
	open: boolean;
	setIsOpen: (_arg0: boolean) => void;
  	refs: {    
		reference: React.RefObject<ReferenceType | null>;
		floating: React.RefObject<HTMLElement | null>;
		setReference: (_node: ReferenceType | null) => void;
		setFloating: (_node: HTMLElement | null) => void;
	},
  	floatingStyles: React.CSSProperties, 
	context: FloatingContext<ReferenceType>,
	getReferenceProps: (_userProps?: React.HTMLProps<Element>) => Record<string, unknown>, 
	getFloatingProps: (_userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>, 
	easing: (_t: number) => number,
}

const MenuContext = React.createContext<MenuContextType>({
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
	easing: (t: number) => t
});

if (process.env.NODE_ENV !== "production") {
  	MenuContext.displayName = "MenuContext";
}

export default MenuContext;