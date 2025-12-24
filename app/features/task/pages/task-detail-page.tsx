import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { LinkButton } from "~/components/ui/link-button";
import type { EditedValues } from "../components/quick-edit-content";
import { TaskDetailContent } from "../components/task-detail-content";
import {
    createCompleteTaskFormData,
    createDeleteTaskFormData,
    createUpdateTaskFormData,
} from "../lib/quick-edit-form-data";
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
    const saveFetcher = useFetcher({ key: `save-${taskId}` });
    const deleteFetcher = useFetcher({ key: `delete-${taskId}` });
    const completeFetcher = useFetcher({ key: `complete-${taskId}` });

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

    const isSaving = saveFetcher.state !== "idle";
    const isDeleting = deleteFetcher.state !== "idle";
    const isCompleting = completeFetcher.state !== "idle";

    // Track if save operation was initiated
    const hasStartedSaving = useRef(false);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const completeResetTimer = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    // Capture values at save time to avoid stale closure issues
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

    // Handle save success feedback - only when save was explicitly initiated
    useEffect(() => {
        if (!hasStartedSaving.current) {
            return;
        }

        if (saveFetcher.state !== "idle") {
            return;
        }

        if (saveFetcher.data?.success) {
            hasStartedSaving.current = false;
            setSaveSuccess(true);
            if (pendingSaveValues.current) {
                setLastSavedTitle(pendingSaveValues.current.title);
                setLastSavedDescription(pendingSaveValues.current.description);
                pendingSaveValues.current = null;
            }

            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            saveResetTimer.current = setTimeout(() => {
                setSaveSuccess(false);
            }, SAVE_SUCCESS_DURATION_MS);
            return;
        }

        if (saveFetcher.data?.error) {
            hasStartedSaving.current = false;
            pendingSaveValues.current = null;
            setSaveError(true);
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
            }
            errorResetTimer.current = setTimeout(() => {
                setSaveError(false);
            }, ERROR_DISPLAY_DURATION_MS);
        }
    }, [saveFetcher.state, saveFetcher.data]);

    // Handle delete error
    useEffect(() => {
        if (deleteFetcher.state !== "idle") {
            return;
        }
        if (deleteFetcher.data?.success) {
            setShowDeleteConfirm(false);
            setDeleteError(false);
            return;
        }
        if (deleteFetcher.data?.error) {
            setDeleteError(true);
        }
    }, [deleteFetcher.state, deleteFetcher.data]);

    // Handle complete success/error feedback
    useEffect(() => {
        if (completeFetcher.state !== "idle") {
            return;
        }

        if (completeFetcher.data?.success) {
            setCompleteSuccess(true);
            setCompleteError(false);
            if (completeResetTimer.current) {
                clearTimeout(completeResetTimer.current);
            }
            completeResetTimer.current = setTimeout(() => {
                setCompleteSuccess(false);
            }, SAVE_SUCCESS_DURATION_MS);
            return;
        }

        if (completeFetcher.data?.error) {
            setCompleteError(true);
            setCompleteSuccess(false);
            if (completeResetTimer.current) {
                clearTimeout(completeResetTimer.current);
            }
            completeResetTimer.current = setTimeout(() => {
                setCompleteError(false);
            }, ERROR_DISPLAY_DURATION_MS);
        }
    }, [completeFetcher.state, completeFetcher.data]);

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
        hasStartedSaving.current = false;
        pendingSaveValues.current = null;
        if (saveResetTimer.current) {
            clearTimeout(saveResetTimer.current);
            saveResetTimer.current = null;
        }
    }, [taskId, task.title, task.description, isDirty]);

    const handleSave = useCallback(
        (values: EditedValues) => {
            if (isSaving) {
                return;
            }

            hasStartedSaving.current = true;
            pendingSaveValues.current = values;
            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            setSaveError(false);
            setSaveSuccess(false);
            const formData = createUpdateTaskFormData(
                taskId,
                values.title,
                values.description,
            );
            saveFetcher.submit(formData, {
                method: "post",
                action: "/api/task/update",
            });
        },
        [taskId, isSaving, saveFetcher],
    );

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        setDeleteError(false);
        const formData = createDeleteTaskFormData(taskId);
        deleteFetcher.submit(formData, {
            method: "post",
            action: "/api/task/delete",
        });
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setDeleteError(false);
    };

    const handleComplete = () => {
        if (isCompleting) {
            return;
        }
        setCompleteError(false);
        setCompleteSuccess(false);
        if (completeResetTimer.current) {
            clearTimeout(completeResetTimer.current);
        }
        const formData = createCompleteTaskFormData(taskId);
        completeFetcher.submit(formData, {
            method: "post",
            action: "/api/task/update",
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
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                    saveError={saveError}
                    isDeleting={isDeleting}
                    showDeleteConfirm={showDeleteConfirm}
                    deleteError={deleteError}
                    onComplete={handleComplete}
                    isCompleting={isCompleting}
                    completeSuccess={completeSuccess}
                    completeError={completeError}
                />
            </div>
        </div>
    );
}
