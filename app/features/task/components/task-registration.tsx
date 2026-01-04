import { useState, useTransition } from "react";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";
import { useTaskService } from "../hooks/use-task-service";
import { getRandomTaskColor } from "../lib/task-colors";
import { getTaskTypeFromKey, type TaskTypeKey } from "../lib/task-type-items";
import { OperationArea } from "./operation-area";
import { ScheduledDateTimeModal } from "./scheduled-datetime-modal";

export interface TaskRegistrationEvent {
    taskId: string;
    taskTypeKey: TaskTypeKey;
    color: string;
    scheduledAt?: Date;
    isLocalOperation: boolean;
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
    const [isPending, startTransition] = useTransition();
    const taskService = useTaskService();

    const [showScheduledModal, setShowScheduledModal] = useState(false);
    const [pendingRegistration, setPendingRegistration] = useState<{
        taskId: string;
        color: string;
    } | null>(null);

    const handleRegister = (taskTypeKey: TaskTypeKey) => {
        if (isPending) {
            return;
        }

        const taskId = uuidv7();
        const color = getRandomTaskColor();

        if (taskTypeKey === "scheduled") {
            setPendingRegistration({ taskId, color });
            setShowScheduledModal(true);
            return;
        }

        startTransition(async () => {
            try {
                const result = await taskService.create({
                    taskId,
                    taskType: getTaskTypeFromKey(taskTypeKey),
                    color,
                });

                if (result.error) {
                    toast.error(result.error || "failed to create task");
                    return;
                }

                onTaskRegistered?.({
                    taskId,
                    taskTypeKey,
                    color,
                    isLocalOperation: result.isLocalOperation,
                });
            } catch {
                toast.error("failed to create task");
            }
        });
    };

    const handleScheduledConfirm = (scheduledAt: Date) => {
        if (!pendingRegistration) {
            return;
        }

        const { taskId, color } = pendingRegistration;

        startTransition(async () => {
            try {
                const result = await taskService.create({
                    taskId,
                    taskType: getTaskTypeFromKey("scheduled"),
                    color,
                    scheduledAt: scheduledAt.toISOString(),
                });

                if (result.error) {
                    toast.error(result.error || "failed to create task");
                    return;
                }

                onTaskRegistered?.({
                    taskId,
                    taskTypeKey: "scheduled",
                    color,
                    scheduledAt,
                    isLocalOperation: result.isLocalOperation,
                });
            } catch {
                toast.error("failed to create task");
            }
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
