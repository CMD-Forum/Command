"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react";

export default function Accordion({ 
    title,
    icon,
    children
}: { 
    title: string;
    icon: React.ReactElement;
    children: React.ReactNode;
}) {

    const [shown, setShown] = useState<boolean>(false);

    return (
        <div className="h-fit transition-all overflow-hidden mb-2">
            <button className="flex items-center justify-between text-gray-300 hover:text-white transition-all w-full group" onClick={() => setShown(!shown)}>
                <div className="flex gap-1 items-center">
                    {React.cloneElement(icon, {
                        className: "w-4 h-4"
                    })}
                    <p className="text-md text-gray-300 group-hover:!text-white transition-all">{title}</p>                    
                </div>
                <ChevronDownIcon className={`w-5 h-5 transition-all duration-300 ${shown ? "rotate-180" : ""}`} />
            </button>
            <div className="mt-2 mb-2" />
            { shown &&
                children
            }
            <div className="mb-2" />
            <hr />
        </div>
    );
}