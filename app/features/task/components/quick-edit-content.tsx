import { Check, Loader2, Trash, X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Label, TextField } from "~/components/ui/text-field";
import { useTaskTypeItems } from "../hooks/use-task-type-items";
import type { TaskTypeKey } from "../lib/task-type-items";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { DescribeEditWithVoice } from "./describe-edit-with-voice";
import { FieldAddButton } from "./field-add-button";
import { FieldDisplay } from "./field-display";
import { LocalTaskReminderAlert } from "./local-task-reminder-alert";
import { TitleEditWithVoice } from "./title-edit-with-voice";

export type EditingField = "none" | "title" | "description";

export interface EditedValues {
    title: string;
    description: string;
}

interface QuickEditContentProps {
    taskTypeKey: TaskTypeKey;
    color: string;

    initialTitle: string;
    initialDescription: string;

    onDirtyChange: (isDirty: boolean) => void;

    onSave: (values: EditedValues) => void;

    onDelete: () => void;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;

    isSaving?: boolean;
    saveSuccess?: boolean;
    saveError?: boolean;
    isDeleting?: boolean;
    showDeleteConfirm?: boolean;
    deleteError?: boolean;

    defaultEditingField?: EditingField;
    defaultEditingValue?: string;

    isLocalTask?: boolean;
}

export function QuickEditContent({
    taskTypeKey,
    color,
    initialTitle,
    initialDescription,
    onDirtyChange,
    onSave,
    onDelete,
    onDeleteConfirm,
    onDeleteCancel,
    isSaving = false,
    saveSuccess = false,
    saveError = false,
    isDeleting = false,
    showDeleteConfirm = false,
    deleteError = false,
    defaultEditingField,
    defaultEditingValue,
    isLocalTask = false,
}: QuickEditContentProps) {
    const { t } = useTranslation();
    const items = useTaskTypeItems();
    const config = items[taskTypeKey];
    const Icon = config.icon;

    const [editingField, setEditingField] = useState<EditingField>(
        defaultEditingField ?? "none",
    );
    const [editingValue, setEditingValue] = useState(defaultEditingValue ?? "");

    const isDirty = useMemo(() => {
        if (editingField === "none") return false;
        if (editingField === "title") return editingValue !== initialTitle;
        if (editingField === "description")
            return editingValue !== initialDescription;
        return false;
    }, [editingField, editingValue, initialTitle, initialDescription]);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    useEffect(() => {
        if (saveSuccess) {
            setEditingField("none");
            setEditingValue("");
        }
    }, [saveSuccess]);

    const handleStartEditTitle = () => {
        setEditingValue(initialTitle);
        setEditingField("title");
    };

    const handleStartEditDescription = () => {
        setEditingValue(initialDescription);
        setEditingField("description");
    };

    const handleCancelEdit = () => {
        setEditingField("none");
        setEditingValue("");
    };

    const handleSave = () => {
        if (!isDirty || isSaving) return;
        onSave({
            title: editingField === "title" ? editingValue : initialTitle,
            description:
                editingField === "description"
                    ? editingValue
                    : initialDescription,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSave();
    };

    if (editingField === "none") {
        return (
            <>
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <Icon
                            className={`size-24 ${!color ? config.strokeClass : ""}`}
                            label=""
                            fillColor={color || undefined}
                            strokeWidth={color ? 0 : 6}
                        />
                    </div>

                    {isLocalTask && <LocalTaskReminderAlert />}

                    <div className="flex flex-col gap-4">
                        {initialTitle ? (
                            <FieldDisplay
                                label={t("taskDetail.title")}
                                value={initialTitle}
                                onEdit={handleStartEditTitle}
                                maxHeightClass="max-h-12"
                            />
                        ) : (
                            <FieldAddButton
                                label={t("taskDetail.title")}
                                optionalLabel={t("taskDetail.optionalLabel")}
                                onPress={handleStartEditTitle}
                            />
                        )}
                        {initialDescription ? (
                            <FieldDisplay
                                label={t("taskDetail.description")}
                                value={initialDescription}
                                onEdit={handleStartEditDescription}
                                maxHeightClass="max-h-32"
                            />
                        ) : (
                            <FieldAddButton
                                label={t("taskDetail.description")}
                                optionalLabel={t("taskDetail.optionalLabel")}
                                onPress={handleStartEditDescription}
                            />
                        )}
                    </div>

                    <div className="flex justify-start border-t pt-4">
                        <Button
                            variant="ghost-destructive"
                            size="icon"
                            type="button"
                            onPress={onDelete}
                            isDisabled={isDeleting}
                            aria-label={t("taskDetail.deleteTask")}
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
    const fieldLabel = isEditingTitle
        ? t("taskDetail.title")
        : t("taskDetail.description");

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex justify-center">
                    <Icon
                        className={`size-24 ${!color ? config.strokeClass : ""}`}
                        label=""
                        fillColor={color || undefined}
                        strokeWidth={color ? 0 : 6}
                    />
                </div>

                <TextField isDisabled={isSaving}>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                        {fieldLabel}
                    </Label>
                    {isEditingTitle ? (
                        <TitleEditWithVoice
                            value={editingValue}
                            onChange={setEditingValue}
                            placeholder={t("taskDetail.enterTitle")}
                            isDisabled={isSaving}
                            autoFocus={false}
                        />
                    ) : (
                        <DescribeEditWithVoice
                            value={editingValue}
                            onChange={setEditingValue}
                            placeholder={t("taskDetail.enterDescription")}
                            isDisabled={isSaving}
                            autoFocus
                        />
                    )}
                </TextField>

                <div className="flex justify-end gap-2 border-t pt-4">
                    {saveError ? (
                        <div className="flex h-9 items-center gap-2 rounded-md bg-destructive px-4 text-destructive-foreground text-sm">
                            <X className="size-4" />
                            <span>{t("common.failed")}</span>
                        </div>
                    ) : saveSuccess ? (
                        <div className="flex h-9 items-center gap-2 rounded-md bg-success px-4 text-sm text-success-foreground">
                            <Check className="size-4" />
                            <span>{t("common.saved")}</span>
                        </div>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                onPress={handleCancelEdit}
                                isDisabled={isSaving}
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                isDisabled={!isDirty || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>{t("common.saving")}</span>
                                    </>
                                ) : (
                                    t("common.save")
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
