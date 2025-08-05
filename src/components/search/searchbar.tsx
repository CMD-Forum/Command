"use client";

import React, { useState } from "react";
import Button from "../button/button";
import SearchDialog from "./searchdialog";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export default function Searchbar() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return (
		<div className="z-[999999] flex items-center">
			<Button variant="Secondary" className="!min-w-[300px] max-h-8 !hidden md:!flex" onClick={() => setIsOpen(!isOpen)} icon={<MagnifyingGlassIcon />} aria-label="Search Command">
				{"Search Command"}
				<kbd className="ml-auto !bg-grey-one">{"⌘K"}</kbd>
			</Button>
			<Button variant="Ghost" className="md:!hidden" square onClick={() => setIsOpen(!isOpen)} icon={<MagnifyingGlassIcon />} aria-label="Search Command" />
			<SearchDialog isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
}