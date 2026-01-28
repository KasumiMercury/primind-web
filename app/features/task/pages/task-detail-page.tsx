import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { LinkButton } from "~/components/ui/link-button";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import { RecreateTaskDialog } from "../components/recreate-task-dialog";
import { TaskDetailContent } from "../components/task-detail-content";
import { useTaskCompleteConfetti } from "../hooks/use-task-complete-confetti";
import { useTaskEdit } from "../hooks/use-task-edit";
import { useTaskService } from "../hooks/use-task-service";
import type { SerializableTask } from "../server/list-active-tasks.server";

interface TaskDetailPageProps {
    task: SerializableTask;
    isLocalTask?: boolean;
}

const ERROR_DISPLAY_DURATION_MS = 2500;
const CONFETTI_REWARD_ID = "task-complete-confetti-page";

export function TaskDetailPage({
    task,
    isLocalTask = false,
}: TaskDetailPageProps) {
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

    const { triggerConfetti, confettiAnchor } = useTaskCompleteConfetti({
        rewardId: CONFETTI_REWARD_ID,
    });

    const {
        lastSavedTitle,
        lastSavedDescription,
        isSaving,
        saveSuccess,
        saveError,
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

    const completeResetTimer = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // Keep callback ref updated to avoid stale closure
    const syncWithExternalDataRef = useRef(syncWithExternalData);
    useEffect(() => {
        syncWithExternalDataRef.current = syncWithExternalData;
    }, [syncWithExternalData]);

    // Sync with external data when task changes
    useEffect(() => {
        if (!taskId) {
            return;
        }
        syncWithExternalDataRef.current({
            title: task.title,
            description: task.description,
        });
    }, [taskId, task.title, task.description]);

    // Cleanup completeResetTimer on unmount
    useEffect(() => {
        return () => {
            if (completeResetTimer.current) {
                clearTimeout(completeResetTimer.current);
            }
        };
    }, []);

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteError(false);
        startDeleteTransition(async () => {
            try {
                const result = await taskService.delete(taskId);

                if (!result.error) {
                    setShowDeleteConfirm(false);
                    setDeleteError(false);
                    revalidate();
                    navigate("/", { replace: true });
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
        navigate("/", { replace: true });
    };

    const handleRecreateCancel = () => {
        setShowRecreateDialog(false);
    };

    const handleComplete = () => {
        if (isCompletePending) {
            return;
        }
        setCompleteError(false);
        if (completeResetTimer.current) {
            clearTimeout(completeResetTimer.current);
        }

        startCompleteTransition(async () => {
            try {
                const result = await taskService.update({
                    taskId,
                    taskStatus: TaskStatus.COMPLETED,
                    updateMask: ["task_status"],
                });

                if (!result.error) {
                    setCompleteSuccess(true);
                    // Trigger confetti and navigate after animation ends
                    triggerConfetti(() => {
                        revalidate();
                        navigate("/", { replace: true });
                    });
                } else {
                    setCompleteError(true);
                    if (completeResetTimer.current) {
                        clearTimeout(completeResetTimer.current);
                    }
                    completeResetTimer.current = setTimeout(() => {
                        setCompleteError(false);
                    }, ERROR_DISPLAY_DURATION_MS);
                }
            } catch {
                setCompleteError(true);
                if (completeResetTimer.current) {
                    clearTimeout(completeResetTimer.current);
                }
                completeResetTimer.current = setTimeout(() => {
                    setCompleteError(false);
                }, ERROR_DISPLAY_DURATION_MS);
            }
        });
    };

    return (
        <div className="w-full max-w-lg">
            <div className="mb-6">
                <LinkButton variant="ghost" size="sm" href="/">
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Tasks
                </LinkButton>
            </div>
            <div className="rounded-lg border bg-card p-6">
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
            </div>
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
        </div>
    );
}
