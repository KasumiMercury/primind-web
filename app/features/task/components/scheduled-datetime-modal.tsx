import {
    type CalendarDateTime,
    getLocalTimeZone,
    now,
    toCalendarDateTime,
} from "@internationalized/date";
import { useEffect, useMemo, useState } from "react";
import { Label } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { TimeField, TimeInput, TimeSegment } from "~/components/ui/time-field";
import { MINIMUM_SCHEDULE_LEAD_TIME_MINUTES } from "~/features/task/constants";

interface ScheduledDateTimeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (scheduledAt: Date) => void;
    onCancel: () => void;
}

export function ScheduledDateTimeModal({
    isOpen,
    onOpenChange,
    onConfirm,
    onCancel,
}: ScheduledDateTimeModalProps) {
    const [dateTime, setDateTime] = useState<CalendarDateTime>(() =>
        toCalendarDateTime(now(getLocalTimeZone()).add({ hours: 1 })),
    );

    useEffect(() => {
        if (isOpen) {
            setDateTime(
                toCalendarDateTime(now(getLocalTimeZone()).add({ hours: 1 })),
            );
        }
    }, [isOpen]);

    const isTooSoon = useMemo(() => {
        const currentTime = now(getLocalTimeZone());
        const normalizedCurrent = currentTime.set({
            second: 0,
            millisecond: 0,
        });
        const normalizedDateTime = dateTime.set({ second: 0, millisecond: 0 });
        const minimumTime = normalizedCurrent.add({
            minutes: MINIMUM_SCHEDULE_LEAD_TIME_MINUTES,
        });
        return normalizedDateTime.compare(minimumTime) < 0;
    }, [dateTime]);

    const handleQuickAdd = (
        duration: Partial<{
            minutes: number;
            hours: number;
            days: number;
        }>,
    ) => {
        setDateTime((prev) => prev.add(duration));
    };

    const handleRoundTo = (minutes: 0 | 15 | 30 | 45) => {
        setDateTime((prev) => prev.set({ minute: minutes }));
    };

    const handleConfirm = () => {
        const date = dateTime.toDate(getLocalTimeZone());
        onConfirm(date);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            showCloseButton={false}
            isDismissable={false}
        >
            <DialogHeader>
                <DialogTitle>Schedule Task</DialogTitle>
            </DialogHeader>

            <div className="my-6 flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <DatePicker
                        value={dateTime}
                        onChange={(value) =>
                            value &&
                            setDateTime((prev) =>
                                prev.set({
                                    year: value.year,
                                    month: value.month,
                                    day: value.day,
                                }),
                            )
                        }
                        label="Date"
                        className="flex-1"
                    />

                    <TimeField
                        value={dateTime}
                        onChange={(value) =>
                            value &&
                            setDateTime((prev) =>
                                prev.set({
                                    hour: value.hour,
                                    minute: value.minute,
                                }),
                            )
                        }
                        className="flex-1"
                    >
                        <Label className="font-medium text-sm">Time</Label>
                        <TimeInput>
                            {(segment) => <TimeSegment segment={segment} />}
                        </TimeInput>
                    </TimeField>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="font-medium text-muted-foreground text-xs">
                        Quick add
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleQuickAdd({ minutes: 15 })}
                        >
                            +15m
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleQuickAdd({ hours: 1 })}
                        >
                            +1h
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleQuickAdd({ hours: 3 })}
                        >
                            +3h
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleQuickAdd({ days: 1 })}
                        >
                            +1d
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="font-medium text-muted-foreground text-xs">
                        Round to
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleRoundTo(0)}
                        >
                            :00
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleRoundTo(15)}
                        >
                            :15
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleRoundTo(30)}
                        >
                            :30
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleRoundTo(45)}
                        >
                            :45
                        </Button>
                    </div>
                </div>

                {isTooSoon && (
                    <p className="text-destructive text-sm">
                        Schedule time must be at least{" "}
                        {MINIMUM_SCHEDULE_LEAD_TIME_MINUTES} minutes from now
                    </p>
                )}
            </div>

            <DialogFooter>
                <div className="grid w-full grid-cols-2 gap-4">
                    <Button
                        className="order-last"
                        onPress={handleConfirm}
                        isDisabled={isTooSoon}
                    >
                        Confirm
                    </Button>
                    <Button variant="outline" onPress={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
