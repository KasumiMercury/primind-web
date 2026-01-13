import { Toaster } from "sonner";

export type ToasterPosition = "top-center" | "bottom-right";

export const toastOptions = {
    unstyled: true,
    classNames: {
        toast: "flex items-center gap-3 rounded-lg border p-4 shadow-lg",
        title: "font-medium",
        description: "text-sm opacity-90",
        error: "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20",
        success:
            "border-success/30 bg-success/10 text-success dark:border-success/40 dark:bg-success/20",
        warning:
            "border-warning/30 bg-warning/10 text-warning dark:border-warning/40 dark:bg-warning/20",
        info: "border-primary/30 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/20",
        default: "border-border bg-card text-card-foreground",
    },
} as const;

export interface ToasterPositionedProps {
    position: ToasterPosition;
}

export function ToasterPositioned({ position }: ToasterPositionedProps) {
    return <Toaster position={position} toastOptions={toastOptions} />;
}
