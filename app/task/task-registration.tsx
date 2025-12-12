import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";
import { OperationArea } from "./operation-area";
import { getRandomTaskColor } from "./task-colors";
import { createTaskFormData } from "./task-form-data";
import type { TaskTypeKey } from "./task-type-items";

interface FetcherData {
    success?: boolean;
    error?: string;
}

export interface TaskRegistrationEvent {
    taskId: string;
    taskTypeKey: TaskTypeKey;
    color: string;
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
    const hasStartedSubmitting = useRef(false);
    const isSaving = fetcher.state === "submitting";

    useEffect(() => {
        if (!hasStartedSubmitting.current) {
            return;
        }

        if (fetcher.state !== "idle") {
            return;
        }

        hasStartedSubmitting.current = false;
        const data = fetcher.data as FetcherData | undefined;
        if (data?.error) {
            toast.error("failed to create task");
        }
    }, [fetcher.state, fetcher.data]);

    const handleRegister = (taskTypeKey: TaskTypeKey) => {
        if (isSaving) {
            return;
        }

        hasStartedSubmitting.current = true;
        const taskId = uuidv7();
        const color = getRandomTaskColor();
        const formData = createTaskFormData(taskId, taskTypeKey, color);

        fetcher.submit(formData, {
            method: "post",
            action: "/api/task",
        });

        onTaskRegistered?.({ taskId, taskTypeKey, color });
    };

    return (
        <OperationArea
            className={className}
            innerClassName={innerClassName}
            onRegister={handleRegister}
        />
    );
}
