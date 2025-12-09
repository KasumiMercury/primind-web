import { cn } from "~/lib/utils";
import type { SerializableTask } from "~/task/list-active-tasks.server";
import { TaskCard } from "./task-card";

interface TaskCardGridProps {
    tasks: SerializableTask[];
    className?: string;
    onTaskClick?: (task: SerializableTask) => void;
}

export function TaskCardGrid({
    tasks,
    className,
    onTaskClick,
}: TaskCardGridProps) {
    if (tasks.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                No active tasks
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4",
                className,
            )}
        >
            {tasks.map((task) => (
                <TaskCard
                    key={task.taskId}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                />
            ))}
        </div>
    );
}
