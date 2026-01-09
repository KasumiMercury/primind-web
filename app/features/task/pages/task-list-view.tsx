import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useRevalidator } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { AsyncTaskCardGrid } from "~/features/task/components/async-task-card-grid";
import { QuickEditModal } from "~/features/task/components/quick-edit-modal";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/features/task/components/task-registration";
import { TASK_TYPE_KEYS } from "~/features/task/lib/task-type-items";
import type {
    ActiveTasksResult,
    SerializableTask,
} from "~/features/task/server/list-active-tasks.server";
import { useAppLayoutContext } from "~/layouts/app-layout";

interface HomeViewProps {
    tasksPromise: Promise<ActiveTasksResult>;
    isAuthenticated: boolean;
}

export function HomeView({ tasksPromise, isAuthenticated }: HomeViewProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const { openLoginDialog } = useAppLayoutContext();

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    // track previous authentication state to detect logout
    const lastAuthenticatedRef = useRef(isAuthenticated);
    useEffect(() => {
        // clear latestTask only when user logs out
        if (lastAuthenticatedRef.current && !isAuthenticated) {
            setLatestTask(null);
        }
        lastAuthenticatedRef.current = isAuthenticated;
    }, [isAuthenticated]);

    const handleDeleted = () => {
        setLatestTask(null);
        revalidate();
    };

    const handleClosed = () => {
        setLatestTask(null);
        revalidate();
    };

    const handleTaskRegistered = (event: TaskRegistrationEvent) => {
        setLatestTask(event);
        revalidate();
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
                            <AlertTitle>{t("loginRequired.title")}</AlertTitle>
                            <AlertDescription>
                                <p>{t("loginRequired.description")}</p>
                            </AlertDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={openLoginDialog}
                        >
                            {t("auth.login")}
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
                <AsyncTaskCardGrid
                    tasksPromise={tasksPromise}
                    onTaskClick={handleTaskClick}
                />
            </section>

            {/* space for OperationArea */}
            <div className="h-70 w-full shrink-0" aria-hidden="true" />

            <div className="fixed inset-x-0 bottom-0">
                {/* overlay for narrow screens only */}
                <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-black/30 md:hidden"
                    aria-hidden="true"
                />
                <div className="flex items-center justify-center p-4">
                    <TaskRegistration
                        className="w-full max-w-xl drop-shadow-primary/20 drop-shadow-xl"
                        onTaskRegistered={handleTaskRegistered}
                    />
                </div>
            </div>
        </>
    );
}
