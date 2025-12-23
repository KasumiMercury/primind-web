import { Check, Loader2, Trash, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label, TextField } from "~/components/ui/text-field";
import { Textarea } from "~/components/ui/textarea";
import { formatTimestampAbsolute } from "~/features/task/lib/absolute-time";
import { formatTimestampRelative } from "~/features/task/lib/relative-time";
import { TaskStatus, type TaskType } from "~/gen/task/v1/task_pb";
import {
    ITEMS,
    TASK_TYPE_KEYS,
    type TaskTypeKey,
} from "../lib/task-type-items";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { FieldDisplay } from "./field-display";
import type { EditingField } from "./quick-edit-content";

interface TaskDetailContentProps {
    task: SerializableTask;
    title: string;
    description: string;

    editingField: EditingField;
    editingValue: string;
    onStartEditTitle: () => void;
    onStartEditDescription: () => void;
    onEditingValueChange: (value: string) => void;
    onCancelEdit: () => void;

    onSave: () => void;
    onDelete: () => void;
    isSaving?: boolean;
    saveSuccess?: boolean;
    saveError?: boolean;
    isDeleting?: boolean;
    isDirty?: boolean;
    showDeleteConfirm?: boolean;
    deleteError?: boolean;
    onDeleteConfirm?: () => void;
    onDeleteCancel?: () => void;
}

function getTaskTypeKey(taskType: TaskType): TaskTypeKey {
    switch (taskType) {
        case 1:
            return TASK_TYPE_KEYS.SHORT;
        case 2:
            return TASK_TYPE_KEYS.NEAR;
        case 3:
            return TASK_TYPE_KEYS.RELAXED;
        case 4:
            return TASK_TYPE_KEYS.SCHEDULED;
        default:
            return TASK_TYPE_KEYS.NEAR;
    }
}

function getStatusLabel(status: TaskStatus): string {
    switch (status) {
        case TaskStatus.ACTIVE:
            return "Active";
        case TaskStatus.COMPLETED:
            return "Completed";
        default:
            return "Unknown";
    }
}

export function TaskDetailContent({
    task,
    title,
    description,
    editingField,
    editingValue,
    onStartEditTitle,
    onStartEditDescription,
    onEditingValueChange,
    onCancelEdit,
    onSave,
    onDelete,
    isSaving = false,
    saveSuccess = false,
    saveError = false,
    isDeleting = false,
    isDirty = false,
    showDeleteConfirm = false,
    deleteError = false,
    onDeleteConfirm,
    onDeleteCancel,
}: TaskDetailContentProps) {
    const taskTypeKey = getTaskTypeKey(task.taskType);
    const config = ITEMS[taskTypeKey];
    const Icon = config.icon;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isDirty && !isSaving) {
            onSave();
        }
    };

    // Display mode: editingField === "none"
    if (editingField === "none") {
        return (
            <>
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <Icon
                            className="size-24"
                            label=""
                            fillColor={task.color || undefined}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <FieldDisplay
                            label="Title"
                            value={title}
                            onEdit={onStartEditTitle}
                            maxHeightClass="max-h-12"
                            emptyText="No title"
                        />
                        <FieldDisplay
                            label="Description"
                            value={description}
                            onEdit={onStartEditDescription}
                            maxHeightClass="max-h-32"
                            emptyText="No description"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                Status
                            </h3>
                            <p className="text-foreground">
                                {getStatusLabel(task.taskStatus)}
                            </p>
                        </div>

                        {task.createdAt && (
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                    Created
                                </h3>
                                <p className="text-foreground">
                                    {formatTimestampAbsolute(task.createdAt)}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {formatTimestampRelative(task.createdAt)}
                                </p>
                            </div>
                        )}

                        {task.targetAt && (
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                    Target Time
                                </h3>
                                <p className="text-foreground">
                                    {formatTimestampAbsolute(task.targetAt)}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {formatTimestampRelative(task.targetAt)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-start border-t pt-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onPress={onDelete}
                            isDisabled={isDeleting || isSaving}
                            className="text-destructive data-hovered:bg-destructive/10"
                            aria-label="Delete Task"
                        >
                            <Trash className="size-4" />
                        </Button>
                    </div>
                </div>

                <DeleteTaskDialog
                    open={showDeleteConfirm}
                    onOpenChange={(open) => !open && onDeleteCancel?.()}
                    onConfirm={() => onDeleteConfirm?.()}
                    onCancel={() => onDeleteCancel?.()}
                    error={deleteError}
                    isDeleting={isDeleting}
                />
            </>
        );
    }

    // Edit mode: editingField === "title" or "description"
    const isEditingTitle = editingField === "title";
    const fieldLabel = isEditingTitle ? "Title" : "Description";

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex justify-center">
                    <Icon
                        className="size-24"
                        label=""
                        fillColor={task.color || undefined}
                    />
                </div>

                <TextField isDisabled={isSaving}>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                        {fieldLabel}
                    </Label>
                    {isEditingTitle ? (
                        <Input
                            type="text"
                            placeholder="Enter title..."
                            value={editingValue}
                            onChange={(e) =>
                                onEditingValueChange(e.target.value)
                            }
                            autoFocus
                        />
                    ) : (
                        <Textarea
                            placeholder="Enter description..."
                            value={editingValue}
                            onChange={(e) =>
                                onEditingValueChange(e.target.value)
                            }
                            autoFocus
                        />
                    )}
                </TextField>

                <div className="flex justify-end gap-2 border-t pt-4">
                    {saveError ? (
                        <div className="flex h-9 items-center gap-2 rounded-md bg-red-600 px-4 text-sm text-white">
                            <X className="size-4" />
                            <span>Failed</span>
                        </div>
                    ) : saveSuccess ? (
                        <div className="flex h-9 items-center gap-2 rounded-md bg-green-600 px-4 text-sm text-white">
                            <Check className="size-4" />
                            <span>Saved</span>
                        </div>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                onPress={onCancelEdit}
                                isDisabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isDisabled={!isDirty || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </form>

            <DeleteTaskDialog
                open={showDeleteConfirm}
                onOpenChange={(open) => !open && onDeleteCancel?.()}
                onConfirm={() => onDeleteConfirm?.()}
                onCancel={() => onDeleteCancel?.()}
                error={deleteError}
                isDeleting={isDeleting}
            />
        </>
    );
}
