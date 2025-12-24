import type { DateValue } from "@internationalized/date";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
    Calendar as AriaCalendar,
    CalendarCell as AriaCalendarCell,
    CalendarGrid as AriaCalendarGrid,
    CalendarGridBody as AriaCalendarGridBody,
    CalendarGridHeader as AriaCalendarGridHeader,
    CalendarHeaderCell as AriaCalendarHeaderCell,
    type CalendarProps as AriaCalendarProps,
    Heading as AriaHeading,
    type CalendarCellProps,
    type CalendarGridBodyProps,
    type CalendarGridHeaderProps,
    type CalendarGridProps,
    type CalendarHeaderCellProps,
    type HeadingProps,
} from "react-aria-components";

import { cn } from "~/lib/utils";
import { Button } from "./button";

interface CalendarProps<T extends DateValue>
    extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
    className?: string;
}

function Calendar<T extends DateValue>({
    className,
    ...props
}: CalendarProps<T>) {
    return (
        <AriaCalendar
            data-slot="calendar"
            className={cn("w-fit", className)}
            {...props}
        >
            <CalendarHeader />
            <CalendarGrid>
                <CalendarGridHeader>
                    {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                </CalendarGridHeader>
                <CalendarGridBody>
                    {(date) => <CalendarCell date={date} />}
                </CalendarGridBody>
            </CalendarGrid>
        </AriaCalendar>
    );
}

function CalendarHeader({ className }: { className?: string }) {
    return (
        <header
            data-slot="calendar-header"
            className={cn(
                "flex items-center justify-between gap-2 pb-2",
                className,
            )}
        >
            <Button variant="outline" size="icon-sm" slot="previous">
                <ChevronLeftIcon className="size-4" />
            </Button>
            <CalendarHeading className="flex-1 text-center" />
            <Button variant="outline" size="icon-sm" slot="next">
                <ChevronRightIcon className="size-4" />
            </Button>
        </header>
    );
}

function CalendarHeading({ className, ...props }: HeadingProps) {
    return (
        <AriaHeading
            data-slot="calendar-heading"
            className={cn("font-semibold text-sm", className)}
            {...props}
        />
    );
}

function CalendarGrid({ className, ...props }: CalendarGridProps) {
    return (
        <AriaCalendarGrid
            data-slot="calendar-grid"
            className={cn("w-full border-collapse", className)}
            {...props}
        />
    );
}

function CalendarGridHeader({ className, ...props }: CalendarGridHeaderProps) {
    return (
        <AriaCalendarGridHeader
            data-slot="calendar-grid-header"
            className={cn(className)}
            {...props}
        />
    );
}

function CalendarHeaderCell({ className, ...props }: CalendarHeaderCellProps) {
    return (
        <AriaCalendarHeaderCell
            data-slot="calendar-header-cell"
            className={cn(
                "size-9 p-0 text-center font-normal text-muted-foreground text-xs",
                className,
            )}
            {...props}
        />
    );
}

function CalendarGridBody({ className, ...props }: CalendarGridBodyProps) {
    return (
        <AriaCalendarGridBody
            data-slot="calendar-grid-body"
            className={cn(className)}
            {...props}
        />
    );
}

function CalendarCell({ className, ...props }: CalendarCellProps) {
    return (
        <AriaCalendarCell
            data-slot="calendar-cell"
            className={cn(
                "relative flex size-9 items-center justify-center rounded-md p-0 text-center text-sm outline-none",
                "data-hovered:bg-accent data-hovered:text-accent-foreground",
                "data-selected:bg-primary data-selected:text-primary-foreground",
                "data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                "data-outside-month:text-muted-foreground data-outside-month:opacity-50",
                "data-unavailable:line-through data-unavailable:opacity-50",
                "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
                className,
            )}
            {...props}
        />
    );
}

export {
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeader,
    CalendarHeaderCell,
    CalendarHeading,
};
