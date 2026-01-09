import { cn } from "~/lib/utils";

interface TaskCardGridSkeletonProps {
    count?: number;
    className?: string;
}

export function TaskCardGridSkeleton({
    count = 4,
    className,
}: TaskCardGridSkeletonProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4",
                className,
            )}
        >
            {Array.from({ length: count }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't reorder
                <TaskCardSkeleton key={index} />
            ))}
        </div>
    );
}

function TaskCardSkeleton() {
    return (
        <div
            className={cn(
                "flex h-auto w-full flex-col items-center gap-3",
                "rounded-xl border border-border bg-card p-4 sm:p-5",
                "animate-pulse",
            )}
        >
            {/* Icon placeholder */}
            <div className="size-18 shrink-0 rounded-full bg-muted md:size-20" />

            {/* Text placeholders */}
            <div className="h-9" />
        </div>
    );
}
