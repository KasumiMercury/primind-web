import {
    type CalendarDateTime,
    type DateTimeDuration,
    type DateValue,
    getLocalTimeZone,
    now,
    toCalendarDateTime,
} from "@internationalized/date";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MINIMUM_SCHEDULE_LEAD_TIME_MINUTES } from "~/features/task/constants";

interface UseDateTimeStateOptions {
    initialDateTime?: CalendarDateTime;
}

interface UseDateTimeStateReturn {
    dateTime: CalendarDateTime;
    setDateTime: (value: CalendarDateTime) => void;
    setDate: (date: DateValue) => void;
    setTime: (hour: number, minute: number) => void;
    addDuration: (duration: DateTimeDuration) => void;
    toNativeDate: () => Date;
    fromNativeDate: (date: Date) => void;
    isTooSoon: boolean;
    formattedPreview: string;
    reset: () => void;
}

function getDefaultDateTime(): CalendarDateTime {
    return toCalendarDateTime(now(getLocalTimeZone()).add({ hours: 1 }));
}

export function useDateTimeState(
    options: UseDateTimeStateOptions = {},
): UseDateTimeStateReturn {
    const { i18n } = useTranslation();
    const [dateTime, setDateTimeInternal] = useState<CalendarDateTime>(
        () => options.initialDateTime ?? getDefaultDateTime(),
    );

    const setDateTime = useCallback((value: CalendarDateTime) => {
        setDateTimeInternal(value);
    }, []);

    const setDate = useCallback((date: DateValue) => {
        setDateTimeInternal((prev) =>
            prev.set({
                year: date.year,
                month: date.month,
                day: date.day,
            }),
        );
    }, []);

    const setTime = useCallback((hour: number, minute: number) => {
        setDateTimeInternal((prev) =>
            prev.set({
                hour,
                minute,
                second: 0,
                millisecond: 0,
            }),
        );
    }, []);

    const addDuration = useCallback((duration: DateTimeDuration) => {
        setDateTimeInternal((prev) => prev.add(duration));
    }, []);

    const toNativeDate = useCallback((): Date => {
        return dateTime.toDate(getLocalTimeZone());
    }, [dateTime]);

    const fromNativeDate = useCallback((date: Date) => {
        const calendarDateTime = toCalendarDateTime(
            now(getLocalTimeZone()).set({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: 0,
                millisecond: 0,
            }),
        );
        setDateTimeInternal(calendarDateTime);
    }, []);

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

    const formattedPreview = useMemo(() => {
        const nativeDate = dateTime.toDate(getLocalTimeZone());
        const formatter = new Intl.DateTimeFormat(i18n.language, {
            month: "short",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
        });
        return formatter.format(nativeDate);
    }, [dateTime, i18n.language]);

    const reset = useCallback(() => {
        setDateTimeInternal(getDefaultDateTime());
    }, []);

    return {
        dateTime,
        setDateTime,
        setDate,
        setTime,
        addDuration,
        toNativeDate,
        fromNativeDate,
        isTooSoon,
        formattedPreview,
        reset,
    };
}
