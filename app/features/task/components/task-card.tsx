import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { formatTimestampRelative } from "~/features/task/lib/relative-time";
import type { TaskType } from "~/gen/task/v1/task_pb";
import { cn } from "~/lib/utils";
import { useTaskTypeItems } from "../hooks/use-task-type-items";
import { TASK_TYPE_KEYS, type TaskTypeKey } from "../lib/task-type-items";
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
    const { t, i18n } = useTranslation();
    const items = useTaskTypeItems();
    const taskTypeKey = getTaskTypeKey(task.taskType);
    const config = items[taskTypeKey];
    const Icon = config.icon;

    const displayTitle = task.title?.trim() || "";
    const relativeTime = formatTimestampRelative(
        task.createdAt,
        i18n.language,
        t("relativeTime.now"),
    );

    return (
        <Button
            variant="ghost"
            type="button"
            onPress={onPress}
            className={cn(
                "flex h-auto w-full flex-col items-center gap-3",
                "rounded-xl border border-border bg-card p-4 sm:p-5",
                "cursor-pointer text-center transition-all duration-200",
                "data-hovered:scale-[1.02] data-hovered:bg-accent",
                "data-focus-visible:outline-none data-focus-visible:ring-2 data-focus-visible:ring-ring data-focus-visible:ring-offset-2",
                className,
            )}
            aria-label={
                displayTitle ? `Task: ${displayTitle}` : `${config.label} task`
            }
        >
            <div
                className="shrink-0 rounded-full p-2"
                style={{
                    backgroundColor: task.color
                        ? `color-mix(in oklch, ${task.color} 15%, transparent)`
                        : undefined,
                }}
                aria-hidden="true"
            >
                <Icon
                    className={cn(
                        "size-14 md:size-16",
                        !task.color && config.strokeClass,
                    )}
                    label=""
                    fillColor={task.color || undefined}
                    strokeWidth={task.color ? 0 : 5}
                />
            </div>

            {(displayTitle || relativeTime) && (
                <div className="flex w-full min-w-0 flex-col items-center gap-1">
                    <p
                        className="min-h-4 w-full truncate text-center font-medium text-foreground text-xs"
                        title={displayTitle || undefined}
                    >
                        {displayTitle}
                    </p>

                    {relativeTime && (
                        <p className="text-center text-muted-foreground/60 text-xs">
                            {relativeTime}
                        </p>
                    )}
                </div>
            )}
        </Button>
    );
}
