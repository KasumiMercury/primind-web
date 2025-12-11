import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { SerializableTask } from "~/task/list-active-tasks.server";
import { QuickEdit } from "~/task/quick-edit";
import { TaskCardGrid } from "~/task/task-card-grid";
import {
    TaskRegistration,
    type TaskRegistrationEvent,
} from "~/task/task-registration";

interface WelcomeProps {
    tasks: SerializableTask[];
}

export function Welcome({ tasks }: WelcomeProps) {
    const navigate = useNavigate();
    const location = useLocation();

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
