import { useEffect, useRef, useState, useTransition } from "react";
import { useNavigate, useRevalidator } from "react-router";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import { useTaskCompleteConfetti } from "../hooks/use-task-complete-confetti";
import { useTaskEdit } from "../hooks/use-task-edit";
import { useTaskService } from "../hooks/use-task-service";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { RecreateTaskDialog } from "./recreate-task-dialog";
import { TaskDetailContent } from "./task-detail-content";

interface TaskDetailModalProps {
    task: SerializableTask;
    isLocalTask?: boolean;
}

const CONFETTI_REWARD_ID = "task-complete-confetti-modal";

export function TaskDetailModal({
    task,
    isLocalTask = false,
}: TaskDetailModalProps) {
    const {
        taskId,
        title: initialTitle,
        description: initialDescription,
    } = task;
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const taskService = useTaskService();
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
    const [showRecreateDialog, setShowRecreateDialog] = useState(false);

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
                navigate("/", { preventScrollReset: true });
            }
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        startDeleteTransition(async () => {
            try {
                const result = await taskService.delete(taskId);

                if (result.data.success) {
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

    const handleRecreate = () => {
        setShowRecreateDialog(true);
    };

    const handleRecreateComplete = () => {
        setShowRecreateDialog(false);
        revalidate();
        navigate("/", { replace: true, preventScrollReset: true });
    };

    const handleRecreateCancel = () => {
        setShowRecreateDialog(false);
    };

    const handleComplete = () => {
        startCompleteTransition(async () => {
            try {
                const result = await taskService.update({
                    taskId,
                    taskStatus: TaskStatus.COMPLETED,
                    updateMask: ["task_status"],
                });

                if (!result.error) {
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
                    onRecreate={handleRecreate}
                    isRecreating={showRecreateDialog}
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
                    isLocalTask={isLocalTask}
                />
            </DialogContent>
            {confettiAnchor}
            <RecreateTaskDialog
                open={showRecreateDialog}
                onOpenChange={setShowRecreateDialog}
                task={task}
                currentTitle={lastSavedTitle}
                currentDescription={lastSavedDescription}
                onRecreateComplete={handleRecreateComplete}
                onCancel={handleRecreateCancel}
            />
        </>
    );
}
