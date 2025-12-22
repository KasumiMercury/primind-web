import { Check, Loader2, Trash, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label, TextField } from "~/components/ui/text-field";
import { Textarea } from "~/components/ui/textarea";
import { ITEMS, type TaskTypeKey } from "../lib/task-type-items";
import { DeleteTaskDialog } from "./delete-task-dialog";

interface QuickEditContentProps {
    // 表示用
    taskTypeKey: TaskTypeKey;
    color: string;

    // フォーム状態
    title: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;

    // アクション
    onSave: () => void;
    onDelete: () => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;

    // UI状態
    isSaving?: boolean;
    saveSuccess?: boolean;
    saveError?: boolean;
    isDeleting?: boolean;
    isDirty?: boolean;
    showDeleteConfirm?: boolean;
    deleteError?: boolean;
}

export function QuickEditContent({
    taskTypeKey,
    color,
    title,
    description,
    onTitleChange,
    onDescriptionChange,
    onSave,
    onDelete,
    onDeleteConfirm,
    onDeleteCancel,
    isSaving = false,
    saveSuccess = false,
    saveError = false,
    isDeleting = false,
    isDirty = false,
    showDeleteConfirm = false,
    deleteError = false,
}: QuickEditContentProps) {
    const config = ITEMS[taskTypeKey];
    const Icon = config.icon;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isDirty && !isSaving) {
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
                        fillColor={color || undefined}
                    />
                </div>

                <TextField isDisabled={isSaving}>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                        Title
                    </Label>
                    <Input
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

                <TextField isDisabled={isSaving}>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                        Description
                    </Label>
                    <Textarea
                        placeholder="No description"
                        className={
                            !description.trim()
                                ? "placeholder:text-muted-foreground placeholder:italic"
                                : ""
                        }
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                    />
                </TextField>

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
                    ) : (
                        <Button type="submit" isDisabled={!isDirty || isSaving}>
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
                onOpenChange={(open) => !open && onDeleteCancel()}
                onConfirm={onDeleteConfirm}
                onCancel={onDeleteCancel}
                error={deleteError}
                isDeleting={isDeleting}
            />
        </>
    );
}
