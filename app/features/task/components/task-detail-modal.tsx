import { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
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
import type { SerializableTask } from "../server/list-active-tasks.server";
import type { EditingField } from "./quick-edit-content";
import { TaskDetailContent } from "./task-detail-content";

interface TaskDetailModalProps {
    task: SerializableTask;
}

const SAVE_SUCCESS_DURATION_MS = 2500;
const ERROR_DISPLAY_DURATION_MS = 2500;

export function TaskDetailModal({ task }: TaskDetailModalProps) {
    const {
        taskId,
        title: initialTitle,
        description: initialDescription,
    } = task;
    const navigate = useNavigate();
    const saveFetcher = useFetcher({ key: `save-${taskId}` });
    const deleteFetcher = useFetcher({ key: `delete-${taskId}` });

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [lastSavedTitle, setLastSavedTitle] = useState(initialTitle);
    const [lastSavedDescription, setLastSavedDescription] =
        useState(initialDescription);
    const [editingField, setEditingField] = useState<EditingField>("none");
    const [editingValue, setEditingValue] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    const isSaving = saveFetcher.state !== "idle";
    const isDeleting = deleteFetcher.state === "submitting";

    const isEditingDirty = useMemo(() => {
        if (editingField === "none") return false;
        if (editingField === "title") return editingValue !== lastSavedTitle;
        if (editingField === "description")
            return editingValue !== lastSavedDescription;
        return false;
    }, [editingField, editingValue, lastSavedTitle, lastSavedDescription]);

    // Track if save operation was initiated
    const hasStartedSaving = useRef(false);
    const saveResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const errorResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
            return;
        }

        if (deleteFetcher.data?.error) {
            setDeleteError(true);
        }
    }, [deleteFetcher.state, deleteFetcher.data]);

    useEffect(() => {
        if (!taskId) {
            return;
        }

        if (editingField !== "none") {
            return;
        }

        setTitle(task.title);
        setDescription(task.description);
        setLastSavedTitle(task.title);
        setLastSavedDescription(task.description);
        setEditingField("none");
        setEditingValue("");
        setSaveSuccess(false);
        hasStartedSaving.current = false;
        pendingSaveValues.current = null;
        if (saveResetTimer.current) {
            clearTimeout(saveResetTimer.current);
            saveResetTimer.current = null;
        }
    }, [taskId, task.title, task.description, editingField]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/", { replace: true, preventScrollReset: true });
        }
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

    return (
        <DialogContent
            isOpen={true}
            onOpenChange={handleOpenChange}
            isDismissable={!isEditingDirty}
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
                isSaving={isSaving}
                saveSuccess={saveSuccess}
                saveError={saveError}
                isDeleting={isDeleting}
                isDirty={isEditingDirty}
                showDeleteConfirm={showDeleteConfirm}
                deleteError={deleteError}
                onDeleteConfirm={handleDeleteConfirm}
                onDeleteCancel={handleDeleteCancel}
            />
        </DialogContent>
    );
}
