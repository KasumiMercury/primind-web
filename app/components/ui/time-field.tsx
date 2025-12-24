import {
    DateInput as AriaDateInput,
    DateSegment as AriaDateSegment,
    TimeField as AriaTimeField,
    type TimeFieldProps as AriaTimeFieldProps,
    type DateInputProps,
    type DateSegmentProps,
    type TimeValue,
} from "react-aria-components";

import { cn } from "~/lib/utils";

interface TimeFieldProps<T extends TimeValue>
    extends Omit<AriaTimeFieldProps<T>, "children"> {
    className?: string;
    children?: React.ReactNode;
}

function TimeField<T extends TimeValue>({
    className,
    children,
    ...props
}: TimeFieldProps<T>) {
    return (
        <AriaTimeField
            data-slot="time-field"
            className={cn("flex flex-col gap-1.5", className)}
            {...props}
        >
            {children}
        </AriaTimeField>
    );
}

function TimeInput({ className, ...props }: DateInputProps) {
    return (
        <AriaDateInput
            data-slot="time-input"
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

function TimeSegment({ className, ...props }: DateSegmentProps) {
    return (
        <AriaDateSegment
            data-slot="time-segment"
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

export { TimeField, TimeInput, TimeSegment };
