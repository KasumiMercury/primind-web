import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { LinkButton } from "~/components/ui/link-button";
import { TaskStatus } from "~/gen/task/v1/task_pb";
import { orpc } from "~/orpc/client";
import type { EditedValues } from "../components/quick-edit-content";
import { TaskDetailContent } from "../components/task-detail-content";
import type { SerializableTask } from "../server/list-active-tasks.server";

interface TaskDetailPageProps {
    task: SerializableTask;
}

const SAVE_SUCCESS_DURATION_MS = 2500;
const ERROR_DISPLAY_DURATION_MS = 2500;

export function TaskDetailPage({ task }: TaskDetailPageProps) {
    const {
        taskId,
        title: initialTitle,
        description: initialDescription,
    } = task;
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const [isSavePending, startSaveTransition] = useTransition();
    const [isDeletePending, startDeleteTransition] = useTransition();
    const [isCompletePending, startCompleteTransition] = useTransition();

    const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
    const [lastSavedDescription, setLastSavedDescription] =
        useState(initialDescription);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [completeSuccess, setCompleteSuccess] = useState(false);
    const [completeError, setCompleteError] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const completeResetTimer = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const pendingSaveValues = useRef<{
        title: string;
        description: string;
    } | null>(null);

    useEffect(() => {
        return () => {
            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
            }
            if (completeResetTimer.current) {
                clearTimeout(completeResetTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!taskId) {
            return;
        }

        if (isDirty) {
            return;
        }

        setLastSavedTitle(task.title);
        setLastSavedDescription(task.description);
        setSaveSuccess(false);
        pendingSaveValues.current = null;
        if (saveResetTimer.current) {
            clearTimeout(saveResetTimer.current);
            saveResetTimer.current = null;
        }
    }, [taskId, task.title, task.description, isDirty]);

    const processSave = useCallback(
        async (values: { title: string; description: string }) => {
            setIsProcessing(true);

            try {
                const result = await orpc.task.update({
                    taskId,
                    title: values.title,
                    description: values.description,
                    updateMask: ["title", "description"],
                });

                if (result.success) {
                    setLastSavedTitle(values.title);
                    setLastSavedDescription(values.description);

                    // Check if there are pending changes made during this save
                    if (
                        pendingSaveValues.current &&
                        (pendingSaveValues.current.title !== values.title ||
                            pendingSaveValues.current.description !==
                                values.description)
                    ) {
                        // Process pending changes
                        const pendingValues = pendingSaveValues.current;
                        pendingSaveValues.current = null;
                        await processSave(pendingValues);
                        return;
                    }

                    pendingSaveValues.current = null;
                    setSaveSuccess(true);

                    if (saveResetTimer.current) {
                        clearTimeout(saveResetTimer.current);
                    }
                    saveResetTimer.current = setTimeout(() => {
                        setSaveSuccess(false);
                    }, SAVE_SUCCESS_DURATION_MS);
                } else {
                    pendingSaveValues.current = null;
                    setSaveError(true);
                    if (errorResetTimer.current) {
                        clearTimeout(errorResetTimer.current);
                    }
                    errorResetTimer.current = setTimeout(() => {
                        setSaveError(false);
                    }, ERROR_DISPLAY_DURATION_MS);
                }
            } catch {
                pendingSaveValues.current = null;
                setSaveError(true);
                if (errorResetTimer.current) {
                    clearTimeout(errorResetTimer.current);
                }
                errorResetTimer.current = setTimeout(() => {
                    setSaveError(false);
                }, ERROR_DISPLAY_DURATION_MS);
            } finally {
                setIsProcessing(false);
            }
        },
        [taskId],
    );

    const handleSave = useCallback(
        (values: EditedValues) => {
            pendingSaveValues.current = values;

            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            setSaveError(false);
            setSaveSuccess(false);

            if (isSavePending || isProcessing) {
                // Save is in progress, pending values will be processed after current save
                return;
            }

            startSaveTransition(async () => {
                await processSave(values);
            });
        },
        [isSavePending, isProcessing, processSave],
    );

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteError(false);
        startDeleteTransition(async () => {
            try {
                const result = await orpc.task.delete({ taskId });

                if (result.success) {
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

    const handleComplete = () => {
        if (isCompletePending) {
            return;
        }
        setCompleteError(false);
        setCompleteSuccess(false);
        if (completeResetTimer.current) {
            clearTimeout(completeResetTimer.current);
        }

        startCompleteTransition(async () => {
            try {
                const result = await orpc.task.update({
                    taskId,
                    taskStatus: TaskStatus.COMPLETED,
                    updateMask: ["task_status"],
                });

                if (result.success) {
                    revalidate();
                    navigate("/", { replace: true });
                } else {
                    setCompleteError(true);
                    setCompleteSuccess(false);
                    if (completeResetTimer.current) {
                        clearTimeout(completeResetTimer.current);
                    }
                    completeResetTimer.current = setTimeout(() => {
                        setCompleteError(false);
                    }, ERROR_DISPLAY_DURATION_MS);
                }
            } catch {
                setCompleteError(true);
                setCompleteSuccess(false);
                if (completeResetTimer.current) {
                    clearTimeout(completeResetTimer.current);
                }
                completeResetTimer.current = setTimeout(() => {
                    setCompleteError(false);
                }, ERROR_DISPLAY_DURATION_MS);
            }
        });
    };

    const isSaving = isSavePending || isProcessing;

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
            </div>
        </div>
    );
}
