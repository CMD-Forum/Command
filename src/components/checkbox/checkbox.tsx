"use client";

import { useState } from "react";
import Typography from "../misc/typography";

/**
 * Form control that toggles between checked and unchecked states.
 */

export default function Checkbox({
    disabled,
    id,
    name,
    label,
    checked,
    onChange,
}: {
    disabled?: boolean;
    id?: string;
    name?: string;
    label: string;
    checked?: boolean;
    onChange?: () => void;
}) {
    const [internalChecked, setInternalChecked] = useState(false);
    const IS_CONTROLLED = checked !== undefined;

    const handleChange = () => {
        if (disabled) return;
        if (onChange && !checked) {
            onChange();
            setInternalChecked(!internalChecked);
        } 
        else setInternalChecked(!internalChecked);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleChange();
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                disabled={disabled}
                id={id}
                name={name}
                checked={IS_CONTROLLED ? checked : internalChecked}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="focus-within"
            />
            <Typography variant="label" htmlFor={id} secondary={disabled} className={disabled ? "!cursor-not-allowed" : ""}>{label}</Typography>
        </div>
    );
}