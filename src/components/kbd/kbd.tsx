import { ReactNode } from "react";

export default function KBD({ children, selectable = true }: { children: ReactNode, selectable?: boolean }) {
    return (
        <kbd className={`bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 ${!selectable && "select-none"}`}>
            {children}
        </kbd>
    );
}