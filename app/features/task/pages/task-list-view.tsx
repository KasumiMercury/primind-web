import { LoginPromptAlert } from "~/features/auth/components/login-prompt-alert";
import { AsyncTaskCardGrid } from "~/features/task/components/async-task-card-grid";
import { OfflineAlert } from "~/features/task/components/offline-alert";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { useNetworkStatus } from "~/hooks/use-network-status";
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
    const { isOffline } = useNetworkStatus();

    return (
        <>
            {isOffline && <OfflineAlert />}

            {!isAuthenticated && !isOffline && (
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
