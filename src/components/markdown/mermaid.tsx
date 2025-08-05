import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef } from "react";

export default function Mermaid({ chart }: { chart: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const uniqueId = useId().replace(/:/g, "-");

    useEffect(() => {
        if (containerRef.current) {
            mermaid.initialize({ 
                startOnLoad: false, 
                theme: theme === "light" ? "base" : "dark",
            });
            mermaid
                .render(`mermaid-${uniqueId}`, chart)
                .then(({ svg }) => {
                    containerRef.current!.innerHTML = svg;
                })
                .catch(() => {
                    containerRef.current!.innerHTML = 
                    `<div 
                            class='md-mermaid-error relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 text-destructive [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90 bg-red-500/10 border-red-500/20'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" x2="12" y1="8" y2="12"></line>
                                <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            <div data-slot="alert-title" class="col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight inter">Error rendering Mermaid diagram</div>
                        </div>`;
                });
        }
    }, [chart, theme]);

    return <div ref={containerRef} />;
}