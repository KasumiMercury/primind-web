import { useFetcher } from "react-router";
import { v7 as uuidv7 } from "uuid";
import { OperationArea } from "./operation-area";
import { createTaskFormData } from "./task-form-data";
import type { TaskTypeKey } from "./task-type-items";

export interface TaskRegistrationEvent {
    taskId: string;
    taskTypeKey: TaskTypeKey;
}

interface TaskRegistrationProps {
    className?: string;
    innerClassName?: string;
    onTaskRegistered?: (event: TaskRegistrationEvent) => void;
}

export function TaskRegistration({
    className,
    innerClassName,
    onTaskRegistered,
}: TaskRegistrationProps) {
    const fetcher = useFetcher();

    const handleRegister = (taskTypeKey: TaskTypeKey) => {
        const taskId = uuidv7();
        const formData = createTaskFormData(taskId, taskTypeKey);

        fetcher.submit(formData, {
            method: "post",
            action: "/api/task",
        });

        onTaskRegistered?.({ taskId, taskTypeKey });
    };

    return (
        <OperationArea
            className={className}
            innerClassName={innerClassName}
            onRegister={handleRegister}
        />
    );
}
