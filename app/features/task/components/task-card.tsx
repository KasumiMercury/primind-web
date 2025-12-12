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
    onClick?: () => void;
}

function getTaskTypeKey(taskType: TaskType): TaskTypeKey {
    switch (taskType) {
        case 1:
            return TASK_TYPE_KEYS.URGENT;
        case 2:
            return TASK_TYPE_KEYS.NORMAL;
        case 3:
            return TASK_TYPE_KEYS.LOW;
        case 4:
            return TASK_TYPE_KEYS.SCHEDULED;
        default:
            return TASK_TYPE_KEYS.NORMAL;
    }
}

export function TaskCard({ task, className, onClick }: TaskCardProps) {
    const taskTypeKey = getTaskTypeKey(task.taskType);
    const config = ITEMS[taskTypeKey];
    const Icon = config.icon;

    const displayTitle = task.title?.trim() || "";
    const relativeTime = formatTimestampRelative(task.createdAt);

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-4",
                "text-left transition-colors",
                "cursor-pointer",
                "hover:bg-accent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
        </button>
    );
}
