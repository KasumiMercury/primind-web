import { Info } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { useAppLayoutContext } from "~/layouts/app-layout";
import type { SerializableTask } from "~/task/list-active-tasks.server";
import { QuickEdit } from "~/task/quick-edit";
import { TaskCardGrid } from "~/task/task-card-grid";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/task/task-registration";

interface WelcomeProps {
    tasks: SerializableTask[];
    isAuthenticated: boolean;
}

export function Welcome({ tasks, isAuthenticated }: WelcomeProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { openLoginDialog } = useAppLayoutContext();

    const [latestTask, setLatestTask] = useState<TaskRegistrationEvent | null>(
        null,
    );

    const handleDeleted = () => {
        setLatestTask(null);
    };

    const handleClosed = () => {
        console.log("QuickEdit closed");
        setLatestTask(null);
    };

    const handleTaskClick = (task: SerializableTask) => {
        navigate(`/tasks/${task.taskId}`, {
            state: {
                backgroundLocation: location,
                tasks: tasks,
            },
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

            {latestTask && (
                <div className="w-full max-w-md rounded-lg border-2 border-secondary px-3 py-3">
                    <QuickEdit
                        key={latestTask.taskId}
                        className="w-full"
                        taskId={latestTask.taskId}
                        taskTypeKey={latestTask.taskTypeKey}
                        color={latestTask.color}
                        onDeleted={handleDeleted}
                        onClosed={handleClosed}
                    />
                </div>
            )}

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
