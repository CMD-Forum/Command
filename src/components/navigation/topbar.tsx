"use client";

import { usePathname } from "next/navigation";
import Searchbar from "../search/searchbar";

export default function Topbar() {
    const PATHNAME = usePathname();
    
    if (PATHNAME !== "/login" && PATHNAME !== "/signup") return (
        <div className="flex justify-between items-center bg-background border-b border-new-grey-600 h-[60px] z-[99999] w-full fixed top-0">
            <div className="absolute left-[50%] -translate-x-1/2"><Searchbar /></div>
        </div>
    );
}