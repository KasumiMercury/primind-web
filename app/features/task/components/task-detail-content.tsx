import { Check, Loader2, RefreshCw, Trash, X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Label, TextField } from "~/components/ui/text-field";
import { formatTimestampAbsolute } from "~/features/task/lib/absolute-time";
import { formatTimestampRelative } from "~/features/task/lib/relative-time";
import { TaskStatus, type TaskType } from "~/gen/task/v1/task_pb";
import { ERROR_CODES, getErrorMessage } from "~/lib/errors";
import { useTaskTypeItems } from "../hooks/use-task-type-items";
import { TASK_TYPE_KEYS, type TaskTypeKey } from "../lib/task-type-items";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { DescribeEdit } from "./describe-edit";
import { FieldDisplay } from "./field-display";
import { LocalTaskReminderAlert } from "./local-task-reminder-alert";
import type { EditedValues, EditingField } from "./quick-edit-content";
import { TitleEdit } from "./title-edit";

interface TaskDetailContentProps {
    task: SerializableTask;

    initialTitle: string;
    initialDescription: string;

    onDirtyChange: (isDirty: boolean) => void;

    onSave: (values: EditedValues) => void;

    onDelete: () => void;
    onDeleteConfirm?: () => void;
    onDeleteCancel?: () => void;

    onRecreate?: () => void;
    isRecreating?: boolean;

    isSaving?: boolean;
    saveSuccess?: boolean;
    saveError?: boolean;
    isDeleting?: boolean;
    showDeleteConfirm?: boolean;
    deleteError?: boolean;

    onComplete?: () => void;
    isCompleting?: boolean;
    completeSuccess?: boolean;
    completeError?: boolean;

    defaultEditingField?: EditingField;
    defaultEditingValue?: string;

    isLocalTask?: boolean;
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

export function TaskDetailContent({
    task,
    initialTitle,
    initialDescription,
    onDirtyChange,
    onSave,
    onDelete,
    onDeleteConfirm,
    onDeleteCancel,
    onRecreate,
    isRecreating = false,
    isSaving = false,
    saveSuccess = false,
    saveError = false,
    isDeleting = false,
    showDeleteConfirm = false,
    deleteError = false,
    onComplete,
    isCompleting = false,
    completeSuccess = false,
    completeError = false,
    defaultEditingField,
    defaultEditingValue,
    isLocalTask = false,
}: TaskDetailContentProps) {
    const { t, i18n } = useTranslation();
    const items = useTaskTypeItems();
    const taskTypeKey = getTaskTypeKey(task.taskType);
    const config = items[taskTypeKey];
    const Icon = config.icon;

    const getStatusLabel = (status: TaskStatus): string => {
        switch (status) {
            case TaskStatus.ACTIVE:
                return t("taskDetail.statusActive");
            case TaskStatus.COMPLETED:
                return t("taskDetail.statusCompleted");
            default:
                return t("taskDetail.statusUnknown");
        }
    };

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

    // Display mode: editingField === "none"
    if (editingField === "none") {
        return (
            <>
                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <Icon
                            className={`size-24 ${!task.color ? config.strokeClass : ""}`}
                            label=""
                            fillColor={task.color || undefined}
                            strokeWidth={task.color ? 0 : 6}
                        />
                    </div>

                    {isLocalTask && <LocalTaskReminderAlert />}

                    <div className="flex flex-col gap-4">
                        <FieldDisplay
                            label={t("taskDetail.title")}
                            value={initialTitle}
                            onEdit={handleStartEditTitle}
                            maxHeightClass="max-h-12"
                            emptyText={t("taskDetail.noTitle")}
                        />
                        <FieldDisplay
                            label={t("taskDetail.description")}
                            value={initialDescription}
                            onEdit={handleStartEditDescription}
                            maxHeightClass="max-h-32"
                            emptyText={t("taskDetail.noDescription")}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                {t("taskDetail.status")}
                            </h3>
                            <p className="text-foreground">
                                {completeSuccess
                                    ? t("taskDetail.statusCompleted")
                                    : getStatusLabel(task.taskStatus)}
                            </p>
                        </div>
                        {task.taskStatus === TaskStatus.ACTIVE &&
                            onComplete &&
                            // !completeSuccess &&
                            (completeError ? (
                                <div className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground text-sm">
                                    <X className="size-5" />
                                    <span>
                                        {getErrorMessage(
                                            t,
                                            ERROR_CODES.TASK_COMPLETE_FAILED,
                                        )}
                                    </span>
                                </div>
                            ) : completeSuccess ? (
                                <div className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-success text-sm text-success-foreground">
                                    <Check className="size-5" />
                                    <span>{t("common.completed")}</span>
                                </div>
                            ) : (
                                <Button
                                    variant="accent"
                                    size="lg"
                                    onPress={onComplete}
                                    isDisabled={
                                        isCompleting || isSaving || isDeleting
                                    }
                                >
                                    {isCompleting ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            <span>
                                                {t("common.completing")}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="size-5" />
                                            <span>{t("common.complete")}</span>
                                        </>
                                    )}
                                </Button>
                            ))}

                        {task.createdAt && (
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                    {t("taskDetail.created")}
                                </h3>
                                <p className="text-foreground">
                                    {formatTimestampAbsolute(
                                        task.createdAt,
                                        i18n.language,
                                    )}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {formatTimestampRelative(
                                        task.createdAt,
                                        i18n.language,
                                        t("relativeTime.now"),
                                    )}
                                </p>
                            </div>
                        )}

                        {task.targetAt && (
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                    {t("taskDetail.targetTime")}
                                </h3>
                                <p className="text-foreground">
                                    {formatTimestampAbsolute(
                                        task.targetAt,
                                        i18n.language,
                                    )}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {formatTimestampRelative(
                                        task.targetAt,
                                        i18n.language,
                                        t("relativeTime.now"),
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-start gap-2 border-t pt-4">
                        <Button
                            variant="ghost-destructive"
                            size="icon"
                            type="button"
                            onPress={onDelete}
                            isDisabled={isDeleting || isSaving || isRecreating}
                            aria-label={t("taskDetail.deleteTask")}
                        >
                            <Trash className="size-4" />
                        </Button>
                        {onRecreate && (
                            <Button
                                variant="ghost"
                                type="button"
                                onPress={onRecreate}
                                isDisabled={
                                    isDeleting || isSaving || isRecreating
                                }
                            >
                                <RefreshCw className="size-4" />
                                <span>{t("recreateTask.button")}</span>
                            </Button>
                        )}
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
    const fieldLabel = isEditingTitle
        ? t("taskDetail.title")
        : t("taskDetail.description");

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex justify-center">
                    <Icon
                        className={`size-24 ${!task.color ? config.strokeClass : ""}`}
                        label=""
                        fillColor={task.color || undefined}
                        strokeWidth={task.color ? 0 : 6}
                    />
                </div>

                <TextField isDisabled={isSaving}>
                    <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                        {fieldLabel}
                    </Label>
                    {isEditingTitle ? (
                        <TitleEdit
                            value={editingValue}
                            onChange={setEditingValue}
                            placeholder={t("taskDetail.enterTitle")}
                            isDisabled={isSaving}
                            autoFocus={false}
                        />
                    ) : (
                        <DescribeEdit
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
                onOpenChange={(open) => !open && onDeleteCancel?.()}
                onConfirm={() => onDeleteConfirm?.()}
                onCancel={() => onDeleteCancel?.()}
                error={deleteError}
                isDeleting={isDeleting}
            />
        </>
    );
}
