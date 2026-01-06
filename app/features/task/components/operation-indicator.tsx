import { ChevronLeft, ChevronRight } from "lucide-react";

export interface OperationIndicatorProps {
    itemCount: number;
    selectedIndex: number;
    className?: string;
    selectedClassName?: string;
    unselectedClassName?: string;
    arrowClassName?: string;
    selectedBgClass?: string;
}

export function OperationIndicator({
    itemCount,
    selectedIndex,
    className = "gap-1.5 rounded-full bg-background/80 px-3 py-2 backdrop-blur-sm",
    selectedClassName = "size-2.5 shadow-sm",
    unselectedClassName = "size-2 border-2 border-primary/30 bg-transparent",
    arrowClassName = "size-3 text-primary",
    selectedBgClass,
}: OperationIndicatorProps) {
    if (itemCount === 0) return null;

    return (
        <div className={`flex items-center justify-around ${className}`}>
            <ChevronLeft className={arrowClassName} />
            {Array.from({ length: itemCount }).map((_, index) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static array
                    key={`operation-indicator-${index}`}
                    className={`rounded-full transition-all duration-200 ${
                        index === selectedIndex
                            ? `${selectedClassName} ${selectedBgClass ?? "bg-primary"}`
                            : unselectedClassName
                    }`}
                />
            ))}
            <ChevronRight className={arrowClassName} />
        </div>
    );
}
