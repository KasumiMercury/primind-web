import { useMemo } from "react";
import { DesktopDateTimePicker } from "./desktop-datetime-picker";
import { MobileDateTimePicker } from "./mobile-datetime-picker";
import type { useDateTimeState } from "./use-datetime-state";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
    if (typeof navigator === "undefined") {
        return "desktop";
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // iOS detection
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return "ios";
    }

    // Android detection
    if (/android/.test(userAgent)) {
        return "android";
    }

    // Also check for mobile touch devices that might not be iOS/Android
    // but still benefit from native pickers
    if ("ontouchstart" in window && /mobile|tablet/.test(userAgent)) {
        return "android"; // Use mobile UI for other touch devices
    }

    return "desktop";
}

interface ScheduledDateTimeInputProps {
    state: ReturnType<typeof useDateTimeState>;
    className?: string;
}

export function ScheduledDateTimeInput({
    state,
    className,
}: ScheduledDateTimeInputProps) {
    const platform = useMemo(() => detectPlatform(), []);
    const isMobile = platform === "ios" || platform === "android";

    if (isMobile) {
        return <MobileDateTimePicker state={state} className={className} />;
    }

    return <DesktopDateTimePicker state={state} className={className} />;
}
