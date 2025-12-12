import { Check, ChevronUp, Loader2, Trash, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { type IconComponent, ITEMS, type TaskTypeKey } from "./task-type-items";

export interface QuickEditContentProps {
    className?: string;
    taskTypeKey: TaskTypeKey;
    color: string;
    title: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSave: () => void;
    onDelete: () => void;
    onClose?: () => void;
    isSaving?: boolean;
    saveSuccess?: boolean;
    saveError?: boolean;
    isDeleting?: boolean;
    showDeleteConfirm?: boolean;
    deleteError?: boolean;
    onDeleteConfirm?: () => void;
    onDeleteCancel?: () => void;
}

export function QuickEditContent({
    className,
    taskTypeKey,
    title,
    color,
    description,
    onTitleChange,
    onDescriptionChange,
    onSave,
    onDelete,
    onClose,
    isSaving = false,
    saveSuccess = false,
    saveError = false,
    isDeleting = false,
    showDeleteConfirm = false,
    deleteError = false,
    onDeleteConfirm,
    onDeleteCancel,
}: QuickEditContentProps) {
    const taskType = ITEMS[taskTypeKey];
    const TaskTypeIcon: IconComponent = taskType.icon;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave();
    };

    return (
        <>
            <form className={className} onSubmit={handleSubmit}>
                <div className="flex items-start gap-3">
                    <div className="size-16 shrink-0">
                        <TaskTypeIcon
                            className={""}
                            label={taskType.label}
                            fillColor={color}
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <Input
                            type="text"
                            placeholder="Task Title"
                            className="h-8 px-2 py-1 text-sm"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            disabled={isSaving}
                        />
                        <Textarea
                            placeholder="Task Description"
                            className="px-2 py-1 text-sm"
                            value={description}
                            onChange={(e) =>
                                onDescriptionChange(e.target.value)
                            }
                            disabled={isSaving}
                        />
                    </div>
                </div>

                {/* reverse flex direction to place delete button's focus order after save button */}
                <div className="mt-2 flex flex-row-reverse justify-between">
                    {saveError ? (
                        <div className="flex h-8 items-center gap-2 rounded-md bg-red-600 px-4 text-sm text-white">
                            <X className="size-4" />
                            <span>Failed</span>
                        </div>
                    ) : saveSuccess ? (
                        <div className="flex h-8 items-center gap-2 rounded-md bg-green-600 px-4 text-sm text-white">
                            <Check className="size-4" />
                            <span>Saved</span>
                        </div>
                    ) : (
                        <Button type="submit" size="sm" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting || isSaving}
                        className="text-destructive hover:bg-destructive/10"
                        aria-label="Delete Task"
                    >
                        <Trash className="size-4" />
                    </Button>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 flex w-full items-center justify-center rounded-md bg-background py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    disabled={isSaving || isDeleting}
                    aria-label="Close Quick Edit"
                >
                    <ChevronUp className="size-5" />
                </button>
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
