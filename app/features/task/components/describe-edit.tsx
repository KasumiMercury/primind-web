import type { ChangeEvent } from "react";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export interface DescribeEditProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isDisabled?: boolean;
    autoFocus?: boolean;
    className?: string;
}

export function DescribeEdit({
    value,
    onChange,
    placeholder,
    isDisabled = false,
    autoFocus = false,
    className,
}: DescribeEditProps) {
    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={cn("flex items-start gap-2", className)}>
            <Textarea
                value={value}
                onChange={handleTextareaChange}
                placeholder={placeholder}
                disabled={isDisabled}
                autoFocus={autoFocus}
                className="flex-1"
            />
        </div>
    );
}
