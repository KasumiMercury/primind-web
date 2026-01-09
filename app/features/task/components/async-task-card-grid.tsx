import { Suspense } from "react";
import { Await, useAsyncError } from "react-router";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "../server/list-active-tasks.server";
import { TaskCardGrid } from "./task-card-grid";
import { TaskCardGridSkeleton } from "./task-card-grid-skeleton";
import { TaskListError } from "./task-list-error";

function TaskListErrorBoundary() {
    const error = useAsyncError();
    const message = error instanceof Error ? error.message : String(error);
    return <TaskListError error={message} />;
}

interface AsyncTaskCardGridProps {
    tasksPromise: Promise<ActiveTasksResult>;
    onTaskClick?: (task: SerializableTask) => void;
}

export function AsyncTaskCardGrid({
    tasksPromise,
    onTaskClick,
}: AsyncTaskCardGridProps) {
    return (
        <Suspense fallback={<TaskCardGridSkeleton count={4} />}>
            <Await
                resolve={tasksPromise}
                errorElement={<TaskListErrorBoundary />}
            >
                {(result: ActiveTasksResult) => {
                    if (result.error) {
                        return <TaskListError error={result.error} />;
                    }
                    return (
                        <TaskCardGrid
                            tasks={result.tasks}
                            onTaskClick={onTaskClick}
                        />
                    );
                }}
            </Await>
        </Suspense>
    );
}
