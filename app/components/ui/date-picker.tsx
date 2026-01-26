import type { DateValue } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import {
    DateInput as AriaDateInput,
    DatePicker as AriaDatePicker,
    type DatePickerProps as AriaDatePickerProps,
    DateSegment as AriaDateSegment,
    Dialog,
    Group,
    Label,
    Popover,
} from "react-aria-components";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";

interface DatePickerProps<T extends DateValue>
    extends Omit<AriaDatePickerProps<T>, "children"> {
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    label?: string;
}

function DatePicker<T extends DateValue>({
    className,
    inputClassName,
    labelClassName,
    label,
    ...props
}: DatePickerProps<T>) {
    return (
        <AriaDatePicker
            data-slot="date-picker"
            className={cn("flex flex-col gap-1.5", className)}
            {...props}
        >
            {label && (
                <Label
                    className={cn("font-medium text-sm", labelClassName)}
                >
                    {label}
                </Label>
            )}
            <Group
                className={cn(
                    "flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-xs outline-none transition-[color,box-shadow] dark:bg-input/30",
                    "data-focus-within:border-ring data-focus-within:ring-[3px] data-focus-within:ring-ring/50",
                    "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
                    "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
                    inputClassName,
                )}
            >
                <AriaDateInput className="flex flex-1 items-center px-3 py-1 text-base md:text-sm">
                    {(segment) => (
                        <AriaDateSegment
                            segment={segment}
                            className={cn(
                                "rounded-sm px-0.5 tabular-nums outline-none",
                                "data-focused:bg-primary data-focused:text-primary-foreground",
                                "data-placeholder:text-muted-foreground",
                                "data-type-literal:px-0 data-type-literal:text-muted-foreground",
                            )}
                        />
                    )}
                </AriaDateInput>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="mr-1 shrink-0"
                >
                    <CalendarIcon className="size-4 text-muted-foreground" />
                </Button>
            </Group>
            <Popover
                data-slot="date-picker-popover"
                placement="bottom end"
                offset={4}
                className={cn(
                    "z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md",
                    "data-entering:fade-in-0 data-entering:zoom-in-95 data-entering:animate-in",
                    "data-exiting:fade-out-0 data-exiting:zoom-out-95 data-exiting:animate-out",
                )}
            >
                <Dialog className="outline-none">
                    <Calendar />
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
}

export { DatePicker };
