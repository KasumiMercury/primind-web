import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";
import { getRandomTaskColor } from "../lib/task-colors";
import { createTaskFormData } from "../lib/task-form-data";
import type { TaskTypeKey } from "../lib/task-type-items";
import { OperationArea } from "./operation-area";
import { ScheduledDateTimeModal } from "./scheduled-datetime-modal";

interface FetcherData {
    success?: boolean;
    error?: string;
}

export interface TaskRegistrationEvent {
    taskId: string;
    taskTypeKey: TaskTypeKey;
    color: string;
    scheduledAt?: Date;
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

    const [showScheduledModal, setShowScheduledModal] = useState(false);
    const [pendingRegistration, setPendingRegistration] = useState<{
        taskId: string;
        color: string;
    } | null>(null);

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

        const taskId = uuidv7();
        const color = getRandomTaskColor();

        if (taskTypeKey === "scheduled") {
            setPendingRegistration({ taskId, color });
            setShowScheduledModal(true);
            return;
        }

        hasStartedSubmitting.current = true;
        const formData = createTaskFormData(taskId, taskTypeKey, color);

        fetcher.submit(formData, {
            method: "post",
            action: "/api/task",
        });

        onTaskRegistered?.({ taskId, taskTypeKey, color });
    };

    const handleScheduledConfirm = (scheduledAt: Date) => {
        if (!pendingRegistration) {
            return;
        }

        hasStartedSubmitting.current = true;
        const { taskId, color } = pendingRegistration;
        const formData = createTaskFormData(
            taskId,
            "scheduled",
            color,
            scheduledAt,
        );

        fetcher.submit(formData, {
            method: "post",
            action: "/api/task",
        });

        onTaskRegistered?.({
            taskId,
            taskTypeKey: "scheduled",
            color,
            scheduledAt,
        });

        setShowScheduledModal(false);
        setPendingRegistration(null);
    };

    const handleScheduledCancel = () => {
        setShowScheduledModal(false);
        setPendingRegistration(null);
    };

    return (
        <>
            <OperationArea
                className={className}
                innerClassName={innerClassName}
                onRegister={handleRegister}
            />
            <ScheduledDateTimeModal
                isOpen={showScheduledModal}
                onOpenChange={setShowScheduledModal}
                onConfirm={handleScheduledConfirm}
                onCancel={handleScheduledCancel}
            />
        </>
    );
}
