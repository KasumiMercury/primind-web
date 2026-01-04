import { CheckCircle } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { useTaskEdit } from "../hooks/use-task-edit";
import { useTaskService } from "../hooks/use-task-service";
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
    const { t } = useTranslation();
    const taskService = useTaskService();

    const [isDeletePending, startDeleteTransition] = useTransition();

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

    const onDeletedRef = useRef(onDeleted);
    useEffect(() => {
        onDeletedRef.current = onDeleted;
    }, [onDeleted]);

    const onClosedRef = useRef(onClosed);
    useEffect(() => {
        onClosedRef.current = onClosed;
    }, [onClosed]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClosedRef.current?.();
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
                    onDeletedRef.current?.();
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
                    <DialogTitle>{t("quickEdit.dialogTitle")}</DialogTitle>
                </div>
                <DialogDescription>
                    {t("quickEdit.dialogDescription")}
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
                isDeleting={isDeletePending}
                showDeleteConfirm={showDeleteConfirm}
                deleteError={deleteError}
            />
            {!isDirty && (
                <Button
                    className="mt-4 w-full"
                    onPress={() => onClosedRef.current?.()}
                >
                    OK
                </Button>
            )}
        </DialogContent>
    );
}
