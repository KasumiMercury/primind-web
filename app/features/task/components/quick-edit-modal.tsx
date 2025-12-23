import { CheckCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {
    createDeleteTaskFormData,
    createUpdateTaskFormData,
} from "../lib/quick-edit-form-data";
import type { TaskTypeKey } from "../lib/task-type-items";
import { type EditingField, QuickEditContent } from "./quick-edit-content";

interface QuickEditModalProps {
    isOpen: boolean;
    taskId: string;
    taskTypeKey: TaskTypeKey;
    color: string;
    onDeleted?: () => void;
    onClosed?: () => void;
}

const SAVE_SUCCESS_DURATION_MS = 2500;
const ERROR_DISPLAY_DURATION_MS = 2500;

export function QuickEditModal({
    isOpen,
    taskId,
    taskTypeKey,
    color,
    onDeleted,
    onClosed,
}: QuickEditModalProps) {
    const saveFetcher = useFetcher({ key: `save-${taskId}` });
    const deleteFetcher = useFetcher({ key: `delete-${taskId}` });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [lastSavedTitle, setLastSavedTitle] = useState("");
    const [lastSavedDescription, setLastSavedDescription] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [editingField, setEditingField] = useState<EditingField>("none");
    const [editingValue, setEditingValue] = useState("");

    const isSaving = saveFetcher.state !== "idle";
    const isDeleting = deleteFetcher.state === "submitting";

    const isEditingDirty = useMemo(() => {
        if (editingField === "none") return false;
        if (editingField === "title") return editingValue !== lastSavedTitle;
        if (editingField === "description")
            return editingValue !== lastSavedDescription;
        return false;
    }, [editingField, editingValue, lastSavedTitle, lastSavedDescription]);

    const hasStartedSaving = useRef(false);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingSaveValues = useRef<{
        title: string;
        description: string;
    } | null>(null);
    const onDeletedRef = useRef(onDeleted);

    useEffect(() => {
        onDeletedRef.current = onDeleted;
    }, [onDeleted]);

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

    // Handle save success feedback
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
                setTitle(pendingSaveValues.current.title);
                setDescription(pendingSaveValues.current.description);
                pendingSaveValues.current = null;
            }

            setEditingField("none");
            setEditingValue("");

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
            setTitle(lastSavedTitle);
            setDescription(lastSavedDescription);
            setSaveError(true);
            if (errorResetTimer.current) {
                clearTimeout(errorResetTimer.current);
            }
            errorResetTimer.current = setTimeout(() => {
                setSaveError(false);
            }, ERROR_DISPLAY_DURATION_MS);
        }
    }, [
        saveFetcher.state,
        saveFetcher.data,
        lastSavedTitle,
        lastSavedDescription,
    ]);

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

    const handleSave = () => {
        if (!isEditingDirty || isSaving) {
            return;
        }

        let newTitle = title;
        let newDescription = description;

        if (editingField === "title") {
            newTitle = editingValue;
            setTitle(editingValue);
        } else if (editingField === "description") {
            newDescription = editingValue;
            setDescription(editingValue);
        }

        hasStartedSaving.current = true;
        pendingSaveValues.current = {
            title: newTitle,
            description: newDescription,
        };
        if (saveResetTimer.current) {
            clearTimeout(saveResetTimer.current);
        }
        setSaveSuccess(false);
        const formData = createUpdateTaskFormData(
            taskId,
            newTitle,
            newDescription,
        );
        saveFetcher.submit(formData, {
            method: "post",
            action: "/api/task/update",
        });
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

    const handleStartEditTitle = () => {
        setEditingValue(title);
        setEditingField("title");
    };

    const handleStartEditDescription = () => {
        setEditingValue(description);
        setEditingField("description");
    };

    const handleCancelEdit = () => {
        setEditingField("none");
        setEditingValue("");
    };

    return (
        <DialogContent
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            isDismissable={!isEditingDirty}
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
                title={title}
                description={description}
                editingField={editingField}
                editingValue={editingValue}
                onStartEditTitle={handleStartEditTitle}
                onStartEditDescription={handleStartEditDescription}
                onEditingValueChange={setEditingValue}
                onCancelEdit={handleCancelEdit}
                onSave={handleSave}
                onDelete={handleDelete}
                onDeleteConfirm={handleDeleteConfirm}
                onDeleteCancel={handleDeleteCancel}
                isSaving={isSaving}
                saveSuccess={saveSuccess}
                saveError={saveError}
                isDeleting={isDeleting}
                isDirty={isEditingDirty}
                showDeleteConfirm={showDeleteConfirm}
                deleteError={deleteError}
            />
            {!isEditingDirty && (
                <Button className="mt-4 w-full" onPress={() => onClosed?.()}>
                    OK
                </Button>
            )}
        </DialogContent>
    );
}
