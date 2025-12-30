import { useEffect, useRef, useState, useTransition } from "react";
import { useNavigate, useRevalidator } from "react-router";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import { orpc } from "~/orpc/client";
import { useTaskCompleteConfetti } from "../hooks/use-task-complete-confetti";
import { useTaskEdit } from "../hooks/use-task-edit";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { TaskDetailContent } from "./task-detail-content";

interface TaskDetailModalProps {
    task: SerializableTask;
}

const CONFETTI_REWARD_ID = "task-complete-confetti-modal";

export function TaskDetailModal({ task }: TaskDetailModalProps) {
    const {
        taskId,
        title: initialTitle,
        description: initialDescription,
    } = task;
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const [isDeletePending, startDeleteTransition] = useTransition();
    const [isCompletePending, startCompleteTransition] = useTransition();

    const {
        triggerConfetti,
        interruptConfetti,
        hasPendingCallback,
        confettiAnchor,
    } = useTaskCompleteConfetti({
        rewardId: CONFETTI_REWARD_ID,
        zIndex: 99999,
    });

    const {
        lastSavedTitle,
        lastSavedDescription,
        isSaving,
        saveSuccess,
        saveError,
        isDirty,
        setIsDirty,
        handleSave,
        syncWithExternalData,
    } = useTaskEdit({
        taskId,
        initialTitle,
        initialDescription,
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [completeError, setCompleteError] = useState(false);
    const [completeSuccess, setCompleteSuccess] = useState(false);

    // Keep callback ref updated to avoid stale closure
    const syncWithExternalDataRef = useRef(syncWithExternalData);
    useEffect(() => {
        syncWithExternalDataRef.current = syncWithExternalData;
    }, [syncWithExternalData]);

    // Sync with external data when task changes (not when callback reference changes)
    useEffect(() => {
        if (!taskId) {
            return;
        }
        syncWithExternalDataRef.current({
            title: task.title,
            description: task.description,
        });
    }, [taskId, task.title, task.description]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // If confetti animation is in progress, interrupt and navigate immediately
            if (hasPendingCallback) {
                interruptConfetti();
            } else {
                navigate("/", { replace: true, preventScrollReset: true });
            }
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        startDeleteTransition(async () => {
            try {
                const result = await orpc.task.delete({ taskId });

                if (result.success) {
                    setDeleteError(false);
                    setShowDeleteConfirm(false);
                    revalidate();
                    navigate("/", { replace: true, preventScrollReset: true });
                } else {
                    setDeleteError(true);
                }
            } catch {
                setDeleteError(true);
            }
        });
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setDeleteError(false);
    };

    const handleComplete = () => {
        startCompleteTransition(async () => {
            try {
                const result = await orpc.task.update({
                    taskId,
                    taskStatus: TaskStatus.COMPLETED,
                    updateMask: ["task_status"],
                });

                if (result.success) {
                    setCompleteError(false);
                    setCompleteSuccess(true);
                    // Trigger confetti and navigate after animation ends
                    triggerConfetti(() => {
                        revalidate();
                        navigate("/", {
                            replace: true,
                            preventScrollReset: true,
                        });
                    });
                } else {
                    setCompleteError(true);
                }
            } catch {
                setCompleteError(true);
            }
        });
    };

    return (
        <>
            <DialogContent
                isOpen={true}
                onOpenChange={handleOpenChange}
                isDismissable={!isDirty}
                className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
            >
                <DialogHeader>
                    <DialogTitle className="sr-only">Task Detail</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    View and edit the details of task.
                </DialogDescription>
                <TaskDetailContent
                    task={task}
                    initialTitle={lastSavedTitle}
                    initialDescription={lastSavedDescription}
                    onDirtyChange={setIsDirty}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onDeleteConfirm={handleDeleteConfirm}
                    onDeleteCancel={handleDeleteCancel}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                    saveError={saveError}
                    isDeleting={isDeletePending}
                    showDeleteConfirm={showDeleteConfirm}
                    deleteError={deleteError}
                    onComplete={handleComplete}
                    isCompleting={isCompletePending}
                    completeSuccess={completeSuccess}
                    completeError={completeError}
                />
            </DialogContent>
            {confettiAnchor}
        </>
    );
}
