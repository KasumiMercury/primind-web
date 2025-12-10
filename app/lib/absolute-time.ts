export function formatAbsoluteTime(date: Date, locale: string = "en"): string {
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatTimestampAbsolute(
    timestamp: { seconds: bigint | string } | undefined,
    locale: string = "en",
): string {
    if (!timestamp) {
        return "";
    }

    const seconds =
        typeof timestamp.seconds === "string"
            ? Number.parseInt(timestamp.seconds, 10)
            : Number(timestamp.seconds);

    const date = new Date(seconds * 1000);
    return formatAbsoluteTime(date, locale);
}
