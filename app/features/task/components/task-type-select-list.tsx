import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { useTaskTypeItems } from "../hooks/use-task-type-items";
import { TASK_TYPE_KEYS, type TaskTypeKey } from "../lib/task-type-items";

interface TaskTypeSelectListProps {
    currentTaskType: TaskTypeKey;
    onSelect: (taskType: TaskTypeKey) => void;
    disabled?: boolean;
}

const TASK_TYPE_ORDER: TaskTypeKey[] = [
    TASK_TYPE_KEYS.SHORT,
    TASK_TYPE_KEYS.NEAR,
    TASK_TYPE_KEYS.RELAXED,
    TASK_TYPE_KEYS.SCHEDULED,
];

export function TaskTypeSelectList({
    currentTaskType,
    onSelect,
    disabled = false,
}: TaskTypeSelectListProps) {
    const { t } = useTranslation();
    const items = useTaskTypeItems();

    return (
        <div className="flex flex-col gap-2">
            <p className="font-medium text-muted-foreground text-sm">
                {t("recreateTask.selectType")}
            </p>
            <div className="flex flex-col gap-2">
                {TASK_TYPE_ORDER.map((key) => {
                    const item = items[key];
                    const Icon = item.icon;
                    const isCurrent = key === currentTaskType;

                    return (
                        <Button
                            key={key}
                            variant="outline"
                            className="h-auto justify-start gap-3 px-4 py-3"
                            onPress={() => onSelect(key)}
                            isDisabled={disabled || isCurrent}
                        >
                            <Icon
                                className={`size-6 ${item.strokeClass} stroke-6`}
                                label=""
                            />
                            <span className="text-base">{item.label}</span>
                            {isCurrent && (
                                <span className="ml-auto text-muted-foreground text-xs">
                                    {t("recreateTask.currentType")}
                                </span>
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
