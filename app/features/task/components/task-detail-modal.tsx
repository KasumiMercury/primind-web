import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { useTaskEdit } from "../hooks/use-task-edit";
import {
    createCompleteTaskFormData,
    createDeleteTaskFormData,
} from "../lib/quick-edit-form-data";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { TaskDetailContent } from "./task-detail-content";

interface TaskDetailModalProps {
    task: SerializableTask;
}

export function TaskDetailModal({ task }: TaskDetailModalProps) {
    const {
        taskId,
        title: initialTitle,
        description: initialDescription,
    } = task;
    const navigate = useNavigate();
    const deleteFetcher = useFetcher({ key: `delete-${taskId}` });
    const completeFetcher = useFetcher({ key: `complete-${taskId}` });

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

    const isDeleting = deleteFetcher.state === "submitting";
    const isCompleting = completeFetcher.state === "submitting";

    // Sync with external data when task changes
    useEffect(() => {
        if (!taskId) {
            return;
        }
        syncWithExternalData({
            title: task.title,
            description: task.description,
        });
    }, [taskId, task.title, task.description, syncWithExternalData]);

    // Handle delete success and error
    useEffect(() => {
        if (deleteFetcher.state !== "idle") {
            return;
        }

        if (deleteFetcher.data?.success) {
            setDeleteError(false);
            setShowDeleteConfirm(false);
            return;
        }

        if (deleteFetcher.data?.error) {
            setDeleteError(true);
        }
    }, [deleteFetcher.state, deleteFetcher.data]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/", { replace: true, preventScrollReset: true });
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        const formData = createDeleteTaskFormData(taskId, {
            redirectTo: "/",
        });
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
        const formData = createCompleteTaskFormData(taskId);
        completeFetcher.submit(formData, {
            method: "post",
            action: "/api/task/update",
        });
    };

    return (
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
                isDeleting={isDeleting}
                showDeleteConfirm={showDeleteConfirm}
                deleteError={deleteError}
                onComplete={handleComplete}
                isCompleting={isCompleting}
            />
        </DialogContent>
    );
}
