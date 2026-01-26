import { getLocalTimeZone, today } from "@internationalized/date";
import { Label } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { DatePicker } from "~/components/ui/date-picker";
import { TimeField, TimeInput, TimeSegment } from "~/components/ui/time-field";
import { cn } from "~/lib/utils";
import { DateTimePresets } from "./datetime-presets";
import { TimeSlotPicker } from "./time-slot-picker";
import type { useDateTimeState } from "./use-datetime-state";

interface DesktopDateTimePickerProps {
    state: ReturnType<typeof useDateTimeState>;
    className?: string;
}

export function DesktopDateTimePicker({
    state,
    className,
}: DesktopDateTimePickerProps) {
    const { t } = useTranslation();

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* 日付と時刻の入力 */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <DatePicker
                    value={state.dateTime}
                    onChange={(value) => value && state.setDate(value)}
                    minValue={today(getLocalTimeZone())}
                    granularity="day"
                    label={t("scheduleTask.date")}
                    className="flex-1"
                    inputClassName="h-12"
                    labelClassName="text-muted-foreground text-xs"
                />

                <TimeField
                    value={state.dateTime}
                    onChange={(value) =>
                        value && state.setTime(value.hour, value.minute)
                    }
                    className="flex-1"
                >
                    <Label className="font-medium text-muted-foreground text-xs">
                        {t("scheduleTask.time")}
                    </Label>
                    <TimeInput className="h-12">
                        {(segment) => <TimeSegment segment={segment} />}
                    </TimeInput>
                </TimeField>
            </div>

            {/* クイック選択とよく使う時刻 */}
            <div className="flex flex-col gap-4">
                <DateTimePresets onSelect={state.setDateTime} />

                <TimeSlotPicker
                    selectedHour={state.dateTime.hour}
                    selectedMinute={state.dateTime.minute}
                    onSelect={state.setTime}
                />
            </div>

            <div
                className={cn(
                    "rounded-md border border-border bg-muted/50 px-4 py-3",
                    state.isTooSoon && "border-destructive bg-destructive/10",
                )}
            >
                <span className="font-medium text-sm">
                    {t("scheduleTask.selectedTime", {
                        datetime: state.formattedPreview,
                    })}
                </span>
            </div>
        </div>
    );
}
