import type { DateValue } from "@internationalized/date";
import {
    DateField as AriaDateField,
    type DateFieldProps as AriaDateFieldProps,
    DateInput as AriaDateInput,
    DateSegment as AriaDateSegment,
    type DateInputProps,
    type DateSegmentProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";

interface DateFieldProps<T extends DateValue>
    extends Omit<AriaDateFieldProps<T>, "children"> {
    className?: string;
    children?: React.ReactNode;
}

function DateField<T extends DateValue>({
    className,
    children,
    ...props
}: DateFieldProps<T>) {
    return (
        <AriaDateField
            data-slot="date-field"
            className={cn("flex flex-col gap-1.5", className)}
            {...props}
        >
            {children}
        </AriaDateField>
    );
}

function DateInput({ className, ...props }: DateInputProps) {
    return (
        <AriaDateInput
            data-slot="date-input"
            className={cn(
                "flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm dark:bg-input/30",
                "data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50",
                "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
                "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

function DateSegment({ className, ...props }: DateSegmentProps) {
    return (
        <AriaDateSegment
            data-slot="date-segment"
            className={cn(
                "rounded-sm px-0.5 tabular-nums outline-none",
                "data-focused:bg-primary data-focused:text-primary-foreground",
                "data-placeholder:text-muted-foreground",
                "data-type-literal:px-0 data-type-literal:text-muted-foreground",
                "data-disabled:cursor-not-allowed data-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export { DateField, DateInput, DateSegment };
