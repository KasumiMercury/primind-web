import {
    TextArea as AriaTextArea,
    type TextAreaProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";

function Textarea({ className, ...props }: TextAreaProps) {
    return (
        <AriaTextArea
            data-slot="textarea"
            className={cn(
                "field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground md:text-sm dark:bg-input/30",
                "data-focus-visible:border-ring data-focus-visible:ring-4 data-focus-visible:ring-ring/50",
                "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
                "data-disabled:cursor-not-allowed data-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export { Textarea };
