import { Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { useTaskTypeItems } from "../hooks/use-task-type-items";
import { formatAbsoluteTime } from "../lib/absolute-time";
import type { TaskTypeKey } from "../lib/task-type-items";

interface RecreateConfirmContentProps {
    title: string;
    description: string;
    newTaskType: TaskTypeKey;
    taskColor: string;
    scheduledAt?: Date;
    isProcessing: boolean;
    error: string | null;
    onConfirm: () => void;
    onBack: () => void;
}

export function RecreateConfirmContent({
    title,
    description,
    newTaskType,
    taskColor,
    scheduledAt,
    isProcessing,
    error,
    onConfirm,
    onBack,
}: RecreateConfirmContentProps) {
    const { t, i18n } = useTranslation();
    const items = useTaskTypeItems();
    const taskTypeConfig = items[newTaskType];
    const Icon = taskTypeConfig.icon;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="font-medium text-muted-foreground text-sm">
                    {t("recreateTask.confirmDescription")}
                </p>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border p-4">
                <div>
                    <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        {t("taskDetail.title")}
                    </h4>
                    <p className="text-foreground">
                        {title || t("taskDetail.noTitle")}
                    </p>
                </div>

                <div>
                    <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        {t("taskDetail.description")}
                    </h4>
                    <p className="text-foreground">
                        {description || t("taskDetail.noDescription")}
                    </p>
                </div>

                <div>
                    <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                        {t("recreateTask.newType")}
                    </h4>
                    <div className="flex items-center gap-2">
                        <Icon
                            className={`size-5 ${!taskColor ? taskTypeConfig.strokeClass : ""}`}
                            label=""
                            fillColor={taskColor}
                            strokeWidth={taskColor ? 0 : 4}
                        />
                        <span className="text-foreground">
                            {taskTypeConfig.label}
                        </span>
                    </div>
                </div>

                {scheduledAt && (
                    <div>
                        <h4 className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            {t("recreateTask.scheduledTime")}
                        </h4>
                        <p className="text-foreground">
                            {formatAbsoluteTime(scheduledAt, i18n.language)}
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
                    <X className="size-4" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                    variant="ghost"
                    onPress={onBack}
                    isDisabled={isProcessing}
                >
                    {t("recreateTask.back")}
                </Button>
                <Button onPress={onConfirm} isDisabled={isProcessing}>
                    {isProcessing ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>{t("recreateTask.recreating")}</span>
                        </>
                    ) : (
                        t("recreateTask.confirm")
                    )}
                </Button>
            </div>
        </div>
    );
}
