import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { QuickEditModal } from "~/features/task/components/quick-edit-modal";
import { TaskCardGrid } from "~/features/task/components/task-card-grid";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/features/task/components/task-registration";
import { TASK_TYPE_KEYS } from "~/features/task/lib/task-type-items";
import type { SerializableTask } from "~/features/task/server/list-active-tasks.server";
import { useAppLayoutContext } from "~/layouts/app-layout";

interface HomeViewProps {
    tasks: SerializableTask[];
    isAuthenticated: boolean;
}

export function HomeView({ tasks, isAuthenticated }: HomeViewProps) {
    const navigate = useNavigate();
    const { openLoginDialog } = useAppLayoutContext();

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    useEffect(() => {
        if (!isAuthenticated) {
            setLatestTask(null);
        }
    }, [isAuthenticated]);

    const handleDeleted = () => {
        setLatestTask(null);
    };

    const handleClosed = () => {
        console.log("QuickEdit closed");
        setLatestTask(null);
    };

    const handleTaskClick = (task: SerializableTask) => {
        setLatestTask(null);
        navigate(`/tasks/${task.taskId}`, {
            state: { modal: true },
            preventScrollReset: true,
        });
    };

    return (
        <>
            {!isAuthenticated && (
                <Alert className="w-full max-w-xl">
                    <Info className="h-4 w-4" />
                    <div className="ml-3 flex flex-row items-center justify-between">
                        <div>
                            <AlertTitle>Login Required</AlertTitle>
                            <AlertDescription>
                                <p>Please log in to access all features</p>
                            </AlertDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={openLoginDialog}
                        >
                            Log in
                        </Button>
                    </div>
                </Alert>
            )}

            <QuickEditModal
                key={latestTask?.taskId}
                isOpen={latestTask !== null}
                taskId={latestTask?.taskId ?? ""}
                taskTypeKey={latestTask?.taskTypeKey ?? TASK_TYPE_KEYS.NEAR}
                color={latestTask?.color ?? ""}
                onDeleted={handleDeleted}
                onClosed={handleClosed}
            />

            <section className="w-full max-w-4xl">
                <TaskCardGrid tasks={tasks} onTaskClick={handleTaskClick} />
            </section>

            {/* space for OperationArea */}
            <div className="h-70 w-full shrink-0" aria-hidden="true" />

            <div className="fixed inset-x-0 bottom-0 flex items-center justify-center p-4">
                <TaskRegistration
                    className="w-full max-w-xl"
                    onTaskRegistered={setLatestTask}
                />
            </div>
        </>
    );
}
