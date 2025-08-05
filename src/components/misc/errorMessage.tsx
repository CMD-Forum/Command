import { cn } from "@/lib/utils";

export default function ErrorMessage(props: { message: string | undefined, className?: string }) {
    return (
        <p
            data-slot="form-message"
            className={cn("text-destructive text-sm", props.className)}
            {...props}
        >
            {props.message}
        </p>
    );
}