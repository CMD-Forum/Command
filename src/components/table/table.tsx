import React from "react";

/**
 * ## Table
 * ---
 * Wrapper for the default HTML `table`. Provides rounding with proper borders.
 * @param fullWidth Whether the table stretches to the full width of it's parent container.
 */

export default function Table({ 
    children, 
    fullWidth = true,
}: { 
    children: React.ReactNode;
    fullWidth?: boolean;
}) {
    return (
        <div className={`overflow-hidden ${fullWidth && "w-full"}`}>
            <table>
                {children}
            </table>
        </div>
    );
}