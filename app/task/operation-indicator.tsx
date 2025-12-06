export interface OperationIndicatorProps {
    itemCount: number;
    selectedIndex: number;
    className?: string;
    selectedClassName?: string;
    unselectedClassName?: string;
}

export function OperationIndicator({
    itemCount,
    selectedIndex,
    className = "gap-1.5 rounded-full bg-background/80 px-3 py-2 backdrop-blur-sm",
    selectedClassName = "size-1 bg-primary",
    unselectedClassName = "size-1 border border-primary/50 bg-transparent",
}: OperationIndicatorProps) {
    if (itemCount === 0) return null;

    return (
        <div className={`flex justify-around ${className}`}>
            {Array.from({ length: itemCount }).map((_, index) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static array
                    key={`operation-indicator-${index}`}
                    className={`rounded-full ${
                        index === selectedIndex
                            ? selectedClassName
                            : unselectedClassName
                    }`}
                />
            ))}
        </div>
    );
}
