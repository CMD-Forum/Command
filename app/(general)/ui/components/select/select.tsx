"use client";

import { autoUpdate, flip, FloatingFocusManager, FloatingList, offset, Placement, shift, useClick, useDismiss, useFloating, useInteractions, useListItem, useListNavigation, useRole, useTypeahead } from "@floating-ui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import * as React from "react";

interface SelectContextValue {
    activeIndex: number | null;
    selectedIndex: number | null;
    getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
    // eslint-disable-next-line no-unused-vars
    handleSelect: (index: number | null) => void;
}
  
const SelectContext = React.createContext<SelectContextValue>(
    {} as SelectContextValue
);

export default function Select({
    children,
    defaultPlacement = "bottom-start",
    defaultLabel = "Select",
    onSelect,
    disabled = false
}:{
    children: React.ReactNode;
    defaultPlacement?: Placement;
    defaultLabel?: string;
    onSelect?: any;
    disabled?: boolean;
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
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape') {
                // @ts-ignore
                context.setIsOpen(false);
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [context])

    const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
    const labelsRef = React.useRef<Array<string | null>>([]);

    const handleSelect = React.useCallback((index: number | null) => {
        setSelectedIndex(index);
        setIsOpen(false);
        if (index !== null) {
            const label = labelsRef.current[index];
            setSelectedLabel(label);
            if (onSelect) {
                onSelect(label);
            }
        }
    }, [onSelect]);

    function handleTypeaheadMatch(index: number | null) {
        if (open) {
          setActiveIndex(index);
        } else {
          handleSelect(index);
        }
    }

    const listNav = useListNavigation(context, {
        listRef: elementsRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex
    });
    const typeahead = useTypeahead(context, {
        listRef: labelsRef,
        activeIndex,
        selectedIndex,
        onMatch: handleTypeaheadMatch
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });

    const {
        getReferenceProps,
        getFloatingProps,
        getItemProps
    } = useInteractions([listNav, typeahead, click, dismiss, role]);

    const selectContext = React.useMemo(
        () => ({
          activeIndex,
          selectedIndex,
          getItemProps,
          handleSelect
        }),
        [activeIndex, selectedIndex, getItemProps, handleSelect]
    );

    const easing = cubicBezier(0,0,0,1);

    return (
        // @ts-ignore
        <SelectContext.Provider value={{ open, setIsOpen, refs, floatingStyles, context, getReferenceProps, getFloatingProps, easing, selectContext, selectedLabel, elementsRef, labelsRef, getItemProps, defaultLabel, disabled }}>
            { children }
        </SelectContext.Provider>
    );
}

export function SelectContent({
    children,
}:{
    children: React.ReactNode;
}) {

    const { 
        // @ts-ignore
        open,
        // @ts-ignore
        setIsOpen,
        // @ts-ignore
        refs,
        // @ts-ignore
        floatingStyles,
        // @ts-ignore 
        context,
        // @ts-ignore
        getReferenceProps,
        // @ts-ignore
        getFloatingProps,
        // @ts-ignore
        easing,
        // @ts-ignore
        selectContext,
        // @ts-ignore
        selectedLabel,
        // @ts-ignore
        elementsRef,
        // @ts-ignore
        labelsRef,
        // @ts-ignore
        getItemProps,
        // @ts-ignore
        defaultLabel,
        // @ts-ignore
        disabled
    } = React.useContext(SelectContext);

    return (
        <>
            <button className="navlink" ref={refs.setReference} tabIndex={0} {...getReferenceProps()} disabled={disabled}>
                {selectedLabel ?? defaultLabel}
                <ChevronUpDownIcon className="w-4 h-4" />
            </button>
            <SelectContext.Provider value={selectContext}>
                {open && (
                    <AnimatePresence>
                        <FloatingFocusManager context={context} modal={false}>
                            <div 
                                className="z-40 !max-w-fit !min-w-fit !p-0"
                                /* @ts-ignore */
                                ref={refs.setFloating}
                                /* @ts-ignore */
                                style={floatingStyles}   
                                /* @ts-ignore */
                                {...getFloatingProps()}
                            >               
                                <motion.div 
                                    className={`bg-card border-border border-1 rounded-lg w-full h-max p-1 z-50 min-w-48 shadow-md`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ ease: "backOut", duration: 0.2 }}
                                >
                                    <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                                        {children}
                                    </FloatingList>
                                </motion.div>
                            </div>
                        </FloatingFocusManager>                        
                    </AnimatePresence>
                )}
            </SelectContext.Provider>
        </>
    );
}

export function Option({ label, icon }: { label: string, icon?: React.ReactElement }) {
    const {
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect
    } = React.useContext(SelectContext);
  
    const { ref, index } = useListItem({ label });
  
    const isActive = activeIndex === index;
    const isSelected = selectedIndex === index;
  
    return (
      <button
        ref={ref}
        role="option"
        aria-selected={isActive && isSelected}
        tabIndex={isActive ? 0 : -1}
        className={`hover:bg-border ${isActive ? "!bg-border" : ""} w-full px-3 py-2 flex gap-2 items-center transition-all text-sm group-[hidden]:hidden hover:!text-white subtitle rounded-lg`}
        {...getItemProps({
          onClick: () => handleSelect(index)
        })}
      >
        {icon && React.cloneElement(icon, {
            className: "w-4 h-4",
        })}
        {label}
      </button>
    );
}