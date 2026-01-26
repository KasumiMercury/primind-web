import {
    type CalendarDateTime,
    getLocalTimeZone,
} from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import { DateTimePresets } from "./datetime-presets";
import type { useDateTimeState } from "./use-datetime-state";

interface MobileDateTimePickerProps {
    state: ReturnType<typeof useDateTimeState>;
    className?: string;
}

function toInputValue(dateTime: CalendarDateTime): string {
    const date = dateTime.toDate(getLocalTimeZone());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getMinDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function MobileDateTimePicker({
    state,
    className,
}: MobileDateTimePickerProps) {
    const { t } = useTranslation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            const date = new Date(value);
            state.fromNativeDate(date);
        }
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <DateTimePresets onSelect={state.setDateTime} />

            <div className="flex flex-col gap-2">
                <span className="font-medium text-muted-foreground text-xs">
                    {t("scheduleTask.finetuneTime")}
                </span>
                <div className="relative">
                    <input
                        type="datetime-local"
                        value={toInputValue(state.dateTime)}
                        min={getMinDateTime()}
                        onChange={handleInputChange}
                        className={cn(
                            "h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 pr-10 text-base shadow-xs outline-none transition-[color,box-shadow]",
                            "focus:border-ring focus:ring-[3px] focus:ring-ring/50",
                            "dark:bg-input/30",
                        )}
                    />
                    <span
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                        aria-hidden="true"
                    >
                        <CalendarIcon className="size-4 text-muted-foreground" />
                    </span>
                </div>
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
