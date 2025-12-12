import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export const toastOptions = {
    unstyled: true,
    classNames: {
        toast: "flex items-center gap-3 rounded-lg border p-4 shadow-lg",
        title: "font-medium",
        description: "text-sm opacity-90",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
        success:
            "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
        warning:
            "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
        default:
            "border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100",
    },
} as const;

export function AppToaster() {
    const [position, setPosition] = useState<"top-center" | "bottom-right">(
        "bottom-right",
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        const updatePosition = (e: MediaQueryList | MediaQueryListEvent) => {
            setPosition(e.matches ? "bottom-right" : "top-center");
        };

        updatePosition(mediaQuery);
        mediaQuery.addEventListener("change", updatePosition);

        return () => {
            mediaQuery.removeEventListener("change", updatePosition);
        };
    }, []);

    return <Toaster position={position} toastOptions={toastOptions} />;
}
