import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import {
    createDeleteTaskFormData,
    createUpdateTaskFormData,
} from "../lib/quick-edit-form-data";
import type { TaskTypeKey } from "../lib/task-type-items";
import { QuickEditContent } from "./quick-edit-content";

interface QuickEditProps {
    className?: string;
    taskId: string;
    taskTypeKey: TaskTypeKey;
    color: string;
    onDeleted?: () => void;
    onClosed?: () => void;
}

const SAVE_SUCCESS_DURATION_MS = 2500;
const ERROR_DISPLAY_DURATION_MS = 2500;

export function QuickEdit({
    className,
    taskId,
    taskTypeKey,
    color,
    onDeleted,
    onClosed,
}: QuickEditProps) {
    const saveFetcher = useFetcher();
    const deleteFetcher = useFetcher();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const isSaving = saveFetcher.state === "submitting";
    const isDeleting = deleteFetcher.state === "submitting";

    // Handle save success feedback
    useEffect(() => {
        if (saveFetcher.state === "idle" && saveFetcher.data?.success) {
            setSaveSuccess(true);
            const timer = setTimeout(() => {
                setSaveSuccess(false);
            }, SAVE_SUCCESS_DURATION_MS);
            return () => clearTimeout(timer);
        }
    }, [saveFetcher.state, saveFetcher.data]);

    // Handle save error feedback
    useEffect(() => {
        if (saveFetcher.state === "idle" && saveFetcher.data?.error) {
            setSaveError(true);
            const timer = setTimeout(() => {
                setSaveError(false);
            }, ERROR_DISPLAY_DURATION_MS);
            return () => clearTimeout(timer);
        }
    }, [saveFetcher.state, saveFetcher.data]);

    // Handle delete success
    useEffect(() => {
        if (deleteFetcher.state === "idle" && deleteFetcher.data?.success) {
            setShowDeleteConfirm(false);
            onDeleted?.();
        }
    }, [deleteFetcher.state, deleteFetcher.data, onDeleted]);

    // Handle delete error
    useEffect(() => {
        if (deleteFetcher.state === "idle" && deleteFetcher.data?.error) {
            setDeleteError(true);
        }
    }, [deleteFetcher.state, deleteFetcher.data]);

    const handleSave = () => {
        const formData = createUpdateTaskFormData(taskId, title, description);
        saveFetcher.submit(formData, {
            method: "post",
            action: "/api/task/update",
        });
    };

    const handleDelete = () => {
        setDeleteError(false);
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

    const handleClose = () => {
        onClosed?.();
    };

    return (
        <QuickEditContent
            className={className}
            taskTypeKey={taskTypeKey}
            title={title}
            color={color}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={handleClose}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            saveError={saveError}
            isDeleting={isDeleting}
            showDeleteConfirm={showDeleteConfirm}
            deleteError={deleteError}
            onDeleteConfirm={handleDeleteConfirm}
            onDeleteCancel={handleDeleteCancel}
        />
    );
}
