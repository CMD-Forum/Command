"use client";

import Button from "@/components/button/button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    text: string;
    width_full?: boolean;
    className?: string;
}

export default function BackButton({ className }: { className?: string }) {
    const ROUTER = useRouter();
    return (
        <Button variant="Secondary" icon={<ArrowLeftIcon />} square={true} onClick={ROUTER.back} className={className && className} />
    );

}

export function BackButtonFull(props: BackButtonProps) {
    const ROUTER = useRouter();
    return (
        <Button variant="Secondary" icon={<ArrowLeftIcon />} onClick={ROUTER.back} className={props.className && props.className}>{props.text}</Button>
    );

}