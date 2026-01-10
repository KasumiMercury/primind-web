import { LoginPromptAlert } from "~/features/auth/components/login-prompt-alert";
import { AsyncTaskCardGrid } from "~/features/task/components/async-task-card-grid";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { useHomeShellContext } from "~/layouts/home-shell";

interface TaskListViewProps {
    tasksPromise: Promise<ActiveTasksResult>;
    isAuthenticated: boolean;
    onTaskClick?: (task: SerializableTask) => void;
}

export function TaskListView({
    tasksPromise,
    isAuthenticated,
    onTaskClick,
}: TaskListViewProps) {
    const { openLoginDialog } = useHomeShellContext();

    return (
        <>
            {!isAuthenticated && (
                <LoginPromptAlert onLoginClick={openLoginDialog} />
            )}

            <section className="w-full max-w-4xl">
                <AsyncTaskCardGrid
                    tasksPromise={tasksPromise}
                    onTaskClick={onTaskClick}
                />
            </section>
        </>
    );
}
