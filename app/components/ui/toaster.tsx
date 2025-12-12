import { Toaster } from "sonner";

export const toastOptions = {
    unstyled: true,
    classNames: {
        toast: "flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg dark:border-red-800 dark:bg-red-950",
        title: "font-medium text-red-900 dark:text-red-100",
        description: "text-sm text-red-700 dark:text-red-300",
    },
} as const;

export function AppToaster() {
    return (
        <>
            {/* Mobile: top-center */}
            <div className="block md:hidden">
                <Toaster position="top-center" toastOptions={toastOptions} />
            </div>
            {/* Desktop: bottom-right */}
            <div className="hidden md:block">
                <Toaster position="bottom-right" toastOptions={toastOptions} />
            </div>
        </>
    );
}
