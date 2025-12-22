import { Check, Loader2, Trash, X } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label, TextField } from "~/components/ui/text-field";
import { Textarea } from "~/components/ui/textarea";
import { ITEMS, type TaskTypeKey } from "../lib/task-type-items";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { FieldAddButton } from "./field-add-button";
import { FieldDisplay } from "./field-display";

export type EditingField = "none" | "title" | "description";

interface QuickEditContentProps {
    taskTypeKey: TaskTypeKey;
    color: string;

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
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;

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
    editingField,
    editingValue,
    onStartEditTitle,
    onStartEditDescription,
    onEditingValueChange,
    onCancelEdit,
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

    if (editingField === "none") {
        return (
            <>
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <Icon
                            className="size-24"
                            label=""
                            fillColor={color || undefined}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {title ? (
                            <FieldDisplay
                                label="Title"
                                value={title}
                                onEdit={onStartEditTitle}
                                maxHeightClass="max-h-12"
                            />
                        ) : (
                            <FieldAddButton
                                label="Title"
                                optionalLabel="(Optional)"
                                onPress={onStartEditTitle}
                            />
                        )}
                        {description ? (
                            <FieldDisplay
                                label="Description"
                                value={description}
                                onEdit={onStartEditDescription}
                                maxHeightClass="max-h-32"
                            />
                        ) : (
                            <FieldAddButton
                                label="Description"
                                optionalLabel="(Optional)"
                                onPress={onStartEditDescription}
                            />
                        )}
                    </div>

                    <div className="flex justify-start border-t pt-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onPress={onDelete}
                            isDisabled={isDeleting}
                            className="text-destructive data-hovered:bg-destructive/10"
                            aria-label="Delete Task"
                        >
                            <Trash className="size-4" />
                        </Button>
                    </div>
                </div>

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

    const isEditingTitle = editingField === "title";
    const fieldLabel = isEditingTitle ? "Title" : "Description";

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
                        {fieldLabel}{" "}
                        <span className="normal-case">(Optional)</span>
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
                onOpenChange={(open) => !open && onDeleteCancel()}
                onConfirm={onDeleteConfirm}
                onCancel={onDeleteCancel}
                error={deleteError}
                isDeleting={isDeleting}
            />
        </>
    );
}
