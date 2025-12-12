import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import type { SerializableTask } from "./list-active-tasks.server";
import {
    createDeleteTaskFormData,
    createUpdateTaskFormData,
} from "./quick-edit-form-data";
import { TaskDetailContent } from "./task-detail-content";

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

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
    const [lastSavedDescription, setLastSavedDescription] =
        useState(initialDescription);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const isSaving = saveFetcher.state !== "idle";
    const isDeleting = deleteFetcher.state === "idle";
    const isDirty =
        title !== lastSavedTitle || description !== lastSavedDescription;

    // Track if save operation was initiated
    const hasStartedSaving = useRef(false);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (saveResetTimer.current) {
                clearTimeout(saveResetTimer.current);
            }
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
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
            setLastSavedTitle(title);
            setLastSavedDescription(description);
            setIsEditing(false);

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
            setSaveError(true);
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
            }
            errorResetTimer.current = setTimeout(() => {
                setSaveError(false);
            }, ERROR_DISPLAY_DURATION_MS);
        }
    }, [saveFetcher.state, saveFetcher.data, title, description]);

    // Handle delete error
    useEffect(() => {
        if (deleteFetcher.state === "idle" && deleteFetcher.data?.error) {
            setDeleteError(true);
        }
    }, [deleteFetcher.state, deleteFetcher.data]);

    useEffect(() => {
        if (!taskId) {
            return;
        }
        setTitle(task.title);
        setDescription(task.description);
        setLastSavedTitle(task.title);
        setLastSavedDescription(task.description);
        setIsEditing(false);
        setSaveSuccess(false);
        hasStartedSaving.current = false;
        if (saveResetTimer.current) {
            clearTimeout(saveResetTimer.current);
            saveResetTimer.current = null;
        }
    }, [taskId, task.title, task.description]);

    const handleSave = () => {
        if (!isEditing || !isDirty || isSaving) {
            return;
        }
        hasStartedSaving.current = true;
        if (saveResetTimer.current) {
            clearTimeout(saveResetTimer.current);
        }
        setSaveError(false);
        setSaveSuccess(false);
        const formData = createUpdateTaskFormData(taskId, title, description);
        saveFetcher.submit(formData, {
            method: "post",
            action: "/api/task/update",
        });
    };

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setTitle(lastSavedTitle);
        setDescription(lastSavedDescription);
        setIsEditing(false);
    };

    return (
        <div className="w-full max-w-lg">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Tasks
                    </Link>
                </Button>
            </div>
            <div className="rounded-lg border bg-card p-6">
                <TaskDetailContent
                    task={task}
                    title={title}
                    description={description}
                    isEditing={isEditing}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onEditClick={handleEditClick}
                    onEditCancel={handleEditCancel}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                    saveError={saveError}
                    isDeleting={isDeleting}
                    isDirty={isDirty}
                    showDeleteConfirm={showDeleteConfirm}
                    deleteError={deleteError}
                    onDeleteConfirm={handleDeleteConfirm}
                    onDeleteCancel={handleDeleteCancel}
                />
            </div>
        </div>
    );
}
