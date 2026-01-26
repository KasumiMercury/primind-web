import {
    type CalendarDateTime,
    type DateTimeDuration,
    getLocalTimeZone,
    now,
    toCalendarDateTime,
} from "@internationalized/date";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";

interface Preset {
    key: string;
    labelKey: string;
    getDateTime: () => CalendarDateTime;
}

function getNextSaturday(): CalendarDateTime {
    const current = now(getLocalTimeZone());
    const dayOfWeek = current.toDate().getDay();
    // Sunday = 0, Saturday = 6
    const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
    return toCalendarDateTime(
        current.add({ days: daysUntilSaturday }).set({
            hour: 10,
            minute: 0,
            second: 0,
            millisecond: 0,
        }),
    );
}

function createRelativePreset(
    duration: DateTimeDuration,
): () => CalendarDateTime {
    return () => toCalendarDateTime(now(getLocalTimeZone()).add(duration));
}

function createAbsolutePreset(
    daysOffset: number,
    hour: number,
): () => CalendarDateTime {
    return () => {
        const current = now(getLocalTimeZone());
        return toCalendarDateTime(
            current.add({ days: daysOffset }).set({
                hour,
                minute: 0,
                second: 0,
                millisecond: 0,
            }),
        );
    };
}

const RELATIVE_PRESETS: Preset[] = [
    {
        key: "in30Min",
        labelKey: "scheduleTask.presets.in30Min",
        getDateTime: createRelativePreset({ minutes: 30 }),
    },
    {
        key: "in1Hour",
        labelKey: "scheduleTask.presets.in1Hour",
        getDateTime: createRelativePreset({ hours: 1 }),
    },
    {
        key: "in3Hours",
        labelKey: "scheduleTask.presets.in3Hours",
        getDateTime: createRelativePreset({ hours: 3 }),
    },
];

const ABSOLUTE_PRESETS: Preset[] = [
    {
        key: "tomorrowMorning",
        labelKey: "scheduleTask.presets.tomorrowMorning",
        getDateTime: createAbsolutePreset(1, 9),
    },
    {
        key: "tomorrowEvening",
        labelKey: "scheduleTask.presets.tomorrowEvening",
        getDateTime: createAbsolutePreset(1, 18),
    },
    {
        key: "thisWeekend",
        labelKey: "scheduleTask.presets.thisWeekend",
        getDateTime: getNextSaturday,
    },
];

interface DateTimePresetsProps {
    onSelect: (dateTime: CalendarDateTime) => void;
    className?: string;
}

export function DateTimePresets({ onSelect, className }: DateTimePresetsProps) {
    const { t } = useTranslation();

    return (
        <div className={className}>
            <span className="mb-2 block font-medium text-muted-foreground text-xs">
                {t("scheduleTask.presets.title")}
            </span>

            {/* 時間後系 */}
            <div className="flex flex-wrap gap-2">
                {RELATIVE_PRESETS.map((preset) => (
                    <Button
                        key={preset.key}
                        variant="outline"
                        size="sm"
                        onPress={() => onSelect(preset.getDateTime())}
                    >
                        {t(preset.labelKey as "scheduleTask.presets.in30Min")}
                    </Button>
                ))}
            </div>

            {/* 明日/週末系 */}
            <div className="mt-2 flex flex-wrap gap-2">
                {ABSOLUTE_PRESETS.map((preset) => (
                    <Button
                        key={preset.key}
                        variant="outline"
                        size="sm"
                        onPress={() => onSelect(preset.getDateTime())}
                    >
                        {t(preset.labelKey as "scheduleTask.presets.in30Min")}
                    </Button>
                ))}
            </div>
        </div>
    );
}
