"use client";

import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingList,
    offset,
    Placement,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useListItem,
    useListNavigation,
    useRole,
    useTypeahead
} from "@floating-ui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, cubicBezier } from "motion/react";
import * as m from "motion/react-m";
import * as React from "react";
import { ButtonTypes } from "../button/button";
import SelectContext, { SelectContextType } from "./selectContext";

/**
 * ## Select
 * ---
 * Wrapper for the HTML ``select`` tag. Provides ``FloatingUI`` integration.
 * @param defaultPlacement *Defaults to ``bottom-start``*. The position the select box is placed relative to the button. Note that of there"s no space, the placement will change.
 * @param defaultLabel *Defaults to ``Select``*. The default choice. Name will most likely be changed in the future to avoid confusion with ``label``.
 * @param onSelect *Optional*. What happens when an option is selected.
 * @param disabled *Defaults to ``false``*. Whether the select box is disabled or not.
 * @param btnVariant *Defaults to ``Secondary``^. The variant of the trigger button.
 * @param label *Defaults to ``Label``*. The label of the select box.
 * @param btnClassName *Optional*. If you wish, you can pass additional classes for the trigger button here.
 */

export default function Select({
    children,
    defaultPlacement = "bottom-start",
    defaultSelection: defaultLabel = "Select",
    onSelect,
    disabled = false,
    btnVariant = "Secondary",
    label = "Label",
    btnClassName,
    variant,
    placeholder,
    small,
    icon
}:{
    children: React.ReactNode;
    defaultPlacement?: Placement;
    defaultSelection?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelect?: React.Dispatch<React.SetStateAction<any>> | (() => void);
    disabled?: boolean;
    btnVariant?: ButtonTypes;
    label: string;
    btnClassName?: string;
    variant?: "Standard" | "Outlined";
    placeholder?: string;
    small?: boolean;
    icon?: React.ReactElement;
}) {
    const [open, setIsOpen] = React.useState<boolean>(false);
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
    const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);

    const {refs, floatingStyles, context} = useFloating({
        open: open,
        onOpenChange: setIsOpen,
        middleware: [shift(), flip(), offset(4)],
        whileElementsMounted: autoUpdate,
        placement: defaultPlacement,
    });

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [context])

    const ELEMENTS_REF = React.useRef<Array<HTMLElement | null>>([]);
    const LABELS_REF = React.useRef<Array<string | null>>([]);

    const handleSelect = React.useCallback((index: number | null, value: string) => {
        setSelectedIndex(index);
        setIsOpen(false);
        if (index !== null) {
            const LABEL = LABELS_REF.current[index];
            setSelectedLabel(LABEL);
            if (onSelect) {
                onSelect(value || LABEL);
            }
        }
    }, [onSelect]);

    function handleTypeaheadMatch(index: number | null) {
        if (open) setActiveIndex(index);
        else handleSelect(index, "");
    }

    const LIST_NAV = useListNavigation(context, {
        listRef: ELEMENTS_REF,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex
    });
    const TYPEAHEAD = useTypeahead(context, {
        listRef: LABELS_REF,
        activeIndex,
        selectedIndex,
        onMatch: handleTypeaheadMatch
    });

    const CLICK = useClick(context);
    const DISMISS = useDismiss(context);
    const ROLE = useRole(context, { role: "listbox" });

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps
    } = useInteractions([LIST_NAV, TYPEAHEAD, CLICK, DISMISS, ROLE]);

    const EASING = cubicBezier(0,0,0,1);

    return (
        <SelectContext.Provider 
            value={{
                open, 
                setIsOpen, 
                refs, 
                floatingStyles, 
                context, 
                getReferenceProps, 
                getFloatingProps, 
                easing: EASING,
                selectedLabel, 
                elementsRef: ELEMENTS_REF, 
                labelsRef: LABELS_REF, 
                getItemProps, 
                defaultLabel, 
                disabled, 
                buttonVariant: btnVariant,
                label,
                btnClassName,
                activeIndex: activeIndex,
                selectedIndex: selectedIndex,
                handleSelect: handleSelect,
                variant,
                placeholder,
                small,
                icon
            }}
        >
            { children }
        </SelectContext.Provider>
    );
}

/**
 * ## SelectContent
 * ---
 * Wrapper for the content in a select box.
 */

export function SelectContent({
    children,
}:{
    children: React.ReactNode;
}) {

    const {
        open,
        refs,
        floatingStyles,
        context,
        getReferenceProps,
        getFloatingProps,
        selectedLabel,
        elementsRef: ELEMENTS_REF,
        labelsRef: LABELS_REF,
        defaultLabel,
        disabled,
        label,
        btnClassName,
        variant,
        placeholder,
        small,
        icon
    } = React.use<SelectContextType>(SelectContext);

    const [topLabelWidth, setTopLabelWidth] = React.useState(0);
    const [bottomLabelWidth, setBottomLabelWidth] = React.useState(0);

    const TOP_LABEL_REF = React.useRef<HTMLLabelElement>(null);
    const BOTTOM_LABEL_REF = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const updateWidths = () => {
            if (TOP_LABEL_REF.current) setTopLabelWidth(TOP_LABEL_REF.current.getBoundingClientRect().width - 12);
            if (BOTTOM_LABEL_REF.current) setBottomLabelWidth(BOTTOM_LABEL_REF.current.getBoundingClientRect().width);            
        }

        const OBSERVER = new ResizeObserver(updateWidths);
        if (TOP_LABEL_REF.current) OBSERVER.observe(TOP_LABEL_REF.current);
        if (BOTTOM_LABEL_REF.current) OBSERVER.observe(BOTTOM_LABEL_REF.current);

        return () => OBSERVER.disconnect();
    }, [selectedLabel, defaultLabel, label, TOP_LABEL_REF, BOTTOM_LABEL_REF]);

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
                throw new Error(`[SELECT] The following placement is not valid: \`${placement}\`. Please change it to a valid placement or remove it.`);
        }
    }

    return (
        <>
            <div className="relative inline-block group">
                <button 
                    style={{ minWidth: variant === "Outlined" ? `${Math.max(topLabelWidth || 0, bottomLabelWidth || 0) + 32}px` : "", transition: "none", padding: `0 ${small ? "12px" : "16px"}` }} 
                    type="button" 
                    aria-label={`Select ${label}`} 
                    className={`${open && "active"} ${btnClassName} ${small && "!h-[34px]"} outline-none !py-3 font-bold rounded-sm appearance-none peer border border-border text-white select-input flex items-center justify-center cursor-pointer`} 
                    ref={refs.setReference}
                    tabIndex={0}
                    disabled={disabled}
                    {...getReferenceProps()}
                >
                    { variant === "Outlined" && <label ref={TOP_LABEL_REF} style={{ width: "max-content" }} className="w-fit !text-xs left-2.5 transition-all duration-300 bg-transparent z-10 text-white -translate-y-[18px] scale-75 top-2.5 after:content-[''] after:absolute after:left-0 after:top-[9px] after:w-full after:h-[4px] after:bg-grey-one after:-z-10 whitespace-nowrap">{label}</label> }
                    <div 
                        className="flex gap-1.5 items-center justify-center h-full w-full"
                        ref={BOTTOM_LABEL_REF}
                    >
                        { icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<Partial<{ className: string }>>, {
                            className: "!w-4 !h-4 !rounded-sm text-secondary group-hover:text-white group-focus:text-white transition-all",
                        })}
                        <label className={`${small ? "!text-xs !font-medium" : "!text-sm !font-medium"} transition-all duration-300 bg-transparent text-secondary group-hover:text-white group-focus:text-white pointer-events-none whitespace-nowrap flex-1 text-left`}>{selectedLabel || defaultLabel || placeholder}</label>
                        <ChevronDownIcon className="w-4 h-4 text-secondary group-hover:text-white group-focus:text-white transition-all" />                    
                    </div>                    
                </button>
            </div>
            <AnimatePresence>
                {open &&
                    <FloatingFocusManager context={context} modal={false}>
                        <div 
                            className="z-[999999] !p-0"
                            ref={refs.setFloating}
                            style={{...floatingStyles, minWidth: `calc(${Math.max(200, bottomLabelWidth)}px + 32px)`}}
                            {...getFloatingProps()}
                        >               
                            <m.div
                                className={"MenuContent"}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ ease: "easeInOut", duration: 0.1 }}
                                style={mapPlacementToOrigin(context.placement)}
                            >
                                <FloatingList elementsRef={ELEMENTS_REF} labelsRef={LABELS_REF}>
                                    {children}
                                </FloatingList>
                            </m.div>
                        </div>
                    </FloatingFocusManager>                    
                }
            </AnimatePresence>
        </>
    );
}

/**
 * 
 * @param label The label of the option. Is used as the value if none is specified.
 * @param icon *Optional*. Icon to show before the label text.
 * @param value *Defaults to the value of* `label`. The actual value of the option.
 * @param endIcon *Optional*. Icon to show after the label text.
 */

export function Option({ 
    label,
    icon,
    value = label,
    endIcon
}: { 
    label: string;
    icon?: React.ReactElement;
    value?: string;
    endIcon?: React.ReactElement | null;
}) {
    const {
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect
    } = React.use(SelectContext);
  
    const { ref, index } = useListItem({ label });
  
    const IS_ACTIVE = activeIndex === index;
    const IS_SELECTED = selectedIndex === index;
  
    return (
        <button
            ref={ref}
            role="option"
            aria-selected={IS_SELECTED}
            aria-label={label}
            tabIndex={IS_ACTIVE ? 0 : -1}
            type="button"
            className="focus-within flex items-center justify-between hover:bg-grey-two text-secondary w-full px-2 py-2 font-semibold text-sm group-[hidden]:hidden hover:!text-white rounded cursor-pointer"
            {...getItemProps({
                onClick: () => handleSelect(index, value)
            })}
        >
            <div className="flex gap-2 items-center justify-center w-fit">
                { icon && React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<Partial<{ className: string }>>, {
                    className: `!w-4 !h-4 !rounded-sm ${IS_SELECTED && "!text-white"}`,
                })}
                <span className={`w-fit text-sm ${IS_SELECTED && "!text-white"}`}>{label}</span>
            </div>
            {endIcon && !IS_SELECTED && React.isValidElement(endIcon) && React.cloneElement(endIcon as React.ReactElement<Partial<{ className: string }>>, {
                className: "!w-4 !h-4 !rounded-sm",
            })}
            {IS_SELECTED && <CheckIcon className={`w-4 h-4 hover:!text-white ${IS_SELECTED && "!text-white"}`} />}
        </button>
    );
}
