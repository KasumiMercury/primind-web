import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { v7 as uuidv7 } from "uuid";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { ERROR_CODES, getErrorMessage } from "~/lib/errors";
import { useTaskService } from "../hooks/use-task-service";
import {
    getTaskTypeFromKey,
    TASK_TYPE_KEYS,
    type TaskTypeKey,
} from "../lib/task-type-items";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { RecreateConfirmContent } from "./recreate-confirm-content";
import { ScheduledDateTimeModal } from "./scheduled-datetime-modal";
import { TaskTypeSelectList } from "./task-type-select-list";

type RecreateStep = "type-select" | "scheduled-datetime" | "confirm";

interface RecreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: SerializableTask;
    currentTitle: string;
    currentDescription: string;
    onRecreateComplete: () => void;
    onCancel: () => void;
}

function getTaskTypeKey(taskType: number): TaskTypeKey {
    switch (taskType) {
        case 1:
            return TASK_TYPE_KEYS.SHORT;
        case 2:
            return TASK_TYPE_KEYS.NEAR;
        case 3:
            return TASK_TYPE_KEYS.RELAXED;
        case 4:
            return TASK_TYPE_KEYS.SCHEDULED;
        default:
            return TASK_TYPE_KEYS.NEAR;
    }
}

export function RecreateTaskDialog({
    open,
    onOpenChange,
    task,
    currentTitle,
    currentDescription,
    onRecreateComplete,
    onCancel,
}: RecreateTaskDialogProps) {
    const { t } = useTranslation();
    const taskService = useTaskService();
    const [isPending, startTransition] = useTransition();

    const [step, setStep] = useState<RecreateStep>("type-select");
    const [selectedTaskType, setSelectedTaskType] =
        useState<TaskTypeKey | null>(null);
    const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const currentTaskTypeKey = getTaskTypeKey(task.taskType);

    const resetState = () => {
        setStep("type-select");
        setSelectedTaskType(null);
        setScheduledAt(null);
        setError(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resetState();
            onCancel();
        }
        onOpenChange(newOpen);
    };

    const handleTaskTypeSelect = (taskType: TaskTypeKey) => {
        setSelectedTaskType(taskType);
        setError(null);

        if (taskType === TASK_TYPE_KEYS.SCHEDULED) {
            setStep("scheduled-datetime");
        } else {
            setStep("confirm");
        }
    };

    const handleScheduledConfirm = (date: Date) => {
        setScheduledAt(date);
        setStep("confirm");
    };

    const handleScheduledCancel = () => {
        setStep("type-select");
        setSelectedTaskType(null);
    };

    const handleBack = () => {
        setStep("type-select");
        setSelectedTaskType(null);
        setScheduledAt(null);
        setError(null);
    };

    const handleConfirm = () => {
        if (!selectedTaskType) return;

        startTransition(async () => {
            setError(null);

            const newTaskId = uuidv7();
            const color = task.color;

            try {
                // Create new task
                const createResult = await taskService.create({
                    taskId: newTaskId,
                    taskType: getTaskTypeFromKey(selectedTaskType),
                    color,
                    scheduledAt:
                        selectedTaskType === TASK_TYPE_KEYS.SCHEDULED &&
                        scheduledAt
                            ? scheduledAt.toISOString()
                            : undefined,
                });

                if (createResult.error) {
                    setError(
                        getErrorMessage(
                            t,
                            createResult.error ||
                                ERROR_CODES.TASK_CREATE_FAILED,
                        ),
                    );
                    return;
                }

                // Update title and description
                const updateResult = await taskService.update({
                    taskId: newTaskId,
                    title: currentTitle,
                    description: currentDescription,
                    updateMask: ["title", "description"],
                });

                if (updateResult.error) {
                    console.warn(
                        "Failed to update title/description:",
                        updateResult.error,
                    );
                }

                // Delete original task
                const deleteResult = await taskService.delete(task.taskId);

                if (!deleteResult.data.success) {
                    console.warn(
                        "Failed to delete original task:",
                        deleteResult.error,
                    );
                }

                resetState();
                onRecreateComplete();
            } catch {
                setError(getErrorMessage(t, ERROR_CODES.COMMON_UNEXPECTED));
            }
        });
    };

    return (
        <>
            <DialogContent
                isOpen={open && step !== "scheduled-datetime"}
                onOpenChange={handleOpenChange}
                isDismissable={!isPending}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle>{t("recreateTask.dialogTitle")}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {t("recreateTask.selectType")}
                </DialogDescription>

                <div className="mt-4">
                    {step === "type-select" && (
                        <TaskTypeSelectList
                            currentTaskType={currentTaskTypeKey}
                            onSelect={handleTaskTypeSelect}
                            disabled={isPending}
                        />
                    )}

                    {step === "confirm" && selectedTaskType && (
                        <RecreateConfirmContent
                            title={currentTitle}
                            description={currentDescription}
                            newTaskType={selectedTaskType}
                            taskColor={task.color}
                            scheduledAt={scheduledAt ?? undefined}
                            isProcessing={isPending}
                            error={error}
                            onConfirm={handleConfirm}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </DialogContent>

            <ScheduledDateTimeModal
                isOpen={open && step === "scheduled-datetime"}
                onOpenChange={(newOpen) => {
                    if (!newOpen) {
                        handleScheduledCancel();
                    }
                }}
                onConfirm={handleScheduledConfirm}
                onCancel={handleScheduledCancel}
            />
        </>
    );
}
