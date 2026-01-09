import { cn } from "~/lib/utils";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { TaskCard } from "./task-card";
import { TaskRegistrationOnboarding } from "./task-registration-onboarding";

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
        return <TaskRegistrationOnboarding />;
    }

    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4",
                className,
            )}
        >
            {tasks.map((task) => (
                <TaskCard
                    key={task.taskId}
                    task={task}
                    onPress={() => onTaskClick?.(task)}
                    className="shadow shadow-primary/20"
                />
            ))}
        </div>
    );
}
