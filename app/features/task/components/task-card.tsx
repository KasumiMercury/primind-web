import { Button } from "~/components/ui/button";
import { formatTimestampRelative } from "~/features/task/lib/relative-time";
import type { TaskType } from "~/gen/task/v1/task_pb";
import { cn } from "~/lib/utils";
import {
    ITEMS,
    TASK_TYPE_KEYS,
    type TaskTypeKey,
} from "../lib/task-type-items";
import type { SerializableTask } from "../server/list-active-tasks.server";

interface TaskCardProps {
    task: SerializableTask;
    className?: string;
    onPress?: () => void;
}

function getTaskTypeKey(taskType: TaskType): TaskTypeKey {
    switch (taskType) {
        case 1:
            return TASK_TYPE_KEYS.SHORT;
        case 2:
            return TASK_TYPE_KEYS.NEAR;
        case 3:
            return TASK_TYPE_KEYS.RELAXED;
        case 4:
            return TASK_TYPE_KEYS.SCHEDULED;
        default:
            return TASK_TYPE_KEYS.NEAR;
    }
}

export function TaskCard({ task, className, onPress }: TaskCardProps) {
    const taskTypeKey = getTaskTypeKey(task.taskType);
    const config = ITEMS[taskTypeKey];
    const Icon = config.icon;

    const displayTitle = task.title?.trim() || "";
    const relativeTime = formatTimestampRelative(task.createdAt);

    return (
        <Button
            variant="ghost"
            type="button"
            onPress={onPress}
            className={cn(
                "flex h-auto w-full items-start gap-3 rounded-lg border border-border bg-card p-4",
                "text-left transition-colors",
                "cursor-pointer",
                "data-hovered:bg-accent",
                "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2",
                className,
            )}
            aria-label={
                displayTitle ? `Task: ${displayTitle}` : `${config.label} task`
            }
        >
            <div className="shrink-0">
                <Icon
                    className={"size-12"}
                    label={""}
                    fillColor={task.color || undefined}
                />
            </div>

            <div className="flex min-h-12 min-w-0 flex-1 flex-col justify-between">
                {displayTitle ? (
                    <p
                        className="truncate font-medium text-foreground text-sm"
                        title={displayTitle}
                    >
                        {displayTitle}
                    </p>
                ) : (
                    <span />
                )}

                {relativeTime && (
                    <p className="text-muted-foreground text-xs">
                        {relativeTime}
                    </p>
                )}
            </div>
        </Button>
    );
}
