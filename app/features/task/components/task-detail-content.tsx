import { Check, Loader2, Pencil, Trash, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TextField } from "~/components/ui/text-field";
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

interface TaskDetailContentProps {
    task: SerializableTask;
    title: string;
    description: string;
    isEditing: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onEditClick: () => void;
    onEditCancel: () => void;
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
            return TASK_TYPE_KEYS.URGENT;
        case 2:
            return TASK_TYPE_KEYS.NORMAL;
        case 3:
            return TASK_TYPE_KEYS.LOW;
        case 4:
            return TASK_TYPE_KEYS.SCHEDULED;
        default:
            return TASK_TYPE_KEYS.NORMAL;
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
    isEditing,
    onTitleChange,
    onDescriptionChange,
    onEditClick,
    onEditCancel,
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
        if (isEditing && isDirty && !isSaving) {
            onSave();
        }
    };

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

                <div>
                    <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Title
                    </h3>
                    {isEditing ? (
                        <TextField isDisabled={isSaving} aria-label="Title">
                            <Input
                                id="task-title"
                                type="text"
                                placeholder="No title"
                                className={
                                    !title.trim()
                                        ? "placeholder:text-muted-foreground placeholder:italic"
                                        : ""
                                }
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                            />
                        </TextField>
                    ) : title.trim() ? (
                        <p className="font-semibold text-foreground text-lg">
                            {title}
                        </p>
                    ) : (
                        <p className="text-muted-foreground italic">No title</p>
                    )}
                </div>

                <div>
                    <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        Description
                    </h3>
                    {isEditing ? (
                        <Textarea
                            id="task-description"
                            placeholder="No description"
                            className={
                                !description.trim()
                                    ? "placeholder:text-muted-foreground placeholder:italic"
                                    : ""
                            }
                            value={description}
                            onChange={(e) =>
                                onDescriptionChange(e.target.value)
                            }
                            disabled={isSaving}
                        />
                    ) : description.trim() ? (
                        <p className="whitespace-pre-wrap text-foreground">
                            {description}
                        </p>
                    ) : (
                        <p className="text-muted-foreground italic">
                            No description
                        </p>
                    )}
                </div>

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

                <div className="flex flex-row-reverse items-center justify-between gap-2 border-t pt-4">
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
                    ) : isEditing ? (
                        <div className="flex items-center gap-2">
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
                            <Button
                                type="button"
                                variant="ghost"
                                onPress={onEditCancel}
                                isDisabled={isSaving}
                            >
                                <X className="size-4" />
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onPress={onEditClick}
                            isDisabled={isSaving}
                        >
                            <Pencil className="size-4" />
                            Edit
                        </Button>
                    )}
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
