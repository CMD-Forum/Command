import * as React from "react";

interface DialogContextType {
	isOpen: boolean;
	setIsOpen: (_arg0: boolean) => void;
	isMounted: boolean;
	setIsMounted: React.Dispatch<React.SetStateAction<boolean>>;
	closeButton: boolean;
	title?: string;
	subtitle?: string;
	icon?: React.ReactElement | boolean;
	dialogRef: React.RefObject<HTMLDivElement | null>;
	alert?: boolean;
	"aria-label"?: string;
	alignment?: "center" | "left";
}

const DialogContext = React.createContext<DialogContextType>({
    isOpen: false,
    setIsOpen: () => {},
    isMounted: false,
    setIsMounted: () => {},
    closeButton: false,
    title: "",
	subtitle: "",
    icon: false,
    dialogRef: React.createRef<HTMLDivElement>(),
	alert: false,
	"aria-label": "",
	alignment: "left",
});

if (process.env.NODE_ENV !== "production") {
  	DialogContext.displayName = "DialogContext";
}

export default DialogContext;