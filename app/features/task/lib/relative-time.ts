const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

type TimeUnit =
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "year";

interface TimeThreshold {
    max: number;
    divisor: number;
    unit: TimeUnit;
}

const THRESHOLDS: TimeThreshold[] = [
    { max: MINUTE, divisor: SECOND, unit: "second" },
    { max: HOUR, divisor: MINUTE, unit: "minute" },
    { max: DAY, divisor: HOUR, unit: "hour" },
    { max: WEEK, divisor: DAY, unit: "day" },
    { max: MONTH, divisor: WEEK, unit: "week" },
    { max: YEAR, divisor: MONTH, unit: "month" },
    { max: Number.POSITIVE_INFINITY, divisor: YEAR, unit: "year" },
];

export function formatRelativeTime(
    date: Date,
    locale: string = "en",
    nowText: string = "now",
): string {
    const now = Date.now();
    const diff = date.getTime() - now;
    const absDiff = Math.abs(diff);

    // Return "now" text if less than 1 minute
    if (absDiff < MINUTE) {
        return nowText;
    }

    const formatter = new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style: "long",
    });

    for (const threshold of THRESHOLDS) {
        if (absDiff < threshold.max) {
            const value = Math.round(diff / threshold.divisor);
            return formatter.format(value, threshold.unit);
        }
    }

    return formatter.format(Math.round(diff / YEAR), "year");
}

export function formatTimestampRelative(
    timestamp: { seconds: bigint | string } | undefined,
    locale: string = "en",
    nowText: string = "now",
): string {
    if (!timestamp) {
        return "";
    }

    const seconds =
        typeof timestamp.seconds === "string"
            ? Number.parseInt(timestamp.seconds, 10)
            : Number(timestamp.seconds);

    const date = new Date(seconds * 1000);
    return formatRelativeTime(date, locale, nowText);
}
