import { CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { useTaskEdit } from "../hooks/use-task-edit";
import { createDeleteTaskFormData } from "../lib/quick-edit-form-data";
import type { TaskTypeKey } from "../lib/task-type-items";
import { QuickEditContent } from "./quick-edit-content";

interface QuickEditModalProps {
    isOpen: boolean;
    taskId: string;
    taskTypeKey: TaskTypeKey;
    color: string;
    onDeleted?: () => void;
    onClosed?: () => void;
}

export function QuickEditModal({
    isOpen,
    taskId,
    taskTypeKey,
    color,
    onDeleted,
    onClosed,
}: QuickEditModalProps) {
    const deleteFetcher = useFetcher({ key: `delete-${taskId}` });

    const {
        lastSavedTitle,
        lastSavedDescription,
        isSaving,
        saveSuccess,
        saveError,
        isDirty,
        setIsDirty,
        handleSave,
    } = useTaskEdit({ taskId });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const isDeleting = deleteFetcher.state === "submitting";

    const onDeletedRef = useRef(onDeleted);
    useEffect(() => {
        onDeletedRef.current = onDeleted;
    }, [onDeleted]);

    // Handle delete success and error
    useEffect(() => {
        if (deleteFetcher.state !== "idle") {
            return;
        }

        if (deleteFetcher.data?.success) {
            setDeleteError(false);
            setShowDeleteConfirm(false);
            onDeletedRef.current?.();
            return;
        }

        if (deleteFetcher.data?.error) {
            setDeleteError(true);
        }
    }, [deleteFetcher.state, deleteFetcher.data]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClosed?.();
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
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

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            isDismissable={!isDirty}
            className="max-h-[85vh] overflow-y-auto"
        >
            <DialogHeader className="mb-2 border-b pb-4">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="size-5" />
                    <DialogTitle>Task Created!</DialogTitle>
                </div>
                <DialogDescription>
                    Add details to your new task
                </DialogDescription>
            </DialogHeader>
            <QuickEditContent
                taskTypeKey={taskTypeKey}
                color={color}
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
            />
            {!isDirty && (
                <Button className="mt-4 w-full" onPress={() => onClosed?.()}>
                    OK
                </Button>
            )}
        </DialogContent>
    );
}
