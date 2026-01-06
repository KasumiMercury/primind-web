import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TaskType } from "~/gen/task/v1/task_pb";
import {
    BASE_ITEMS,
    type IconComponent,
    TASK_TYPE_I18N_KEYS,
    type TaskTypeKey,
} from "../lib/task-type-items";

interface TranslatedItemConfig {
    icon: IconComponent;
    label: string;
    strokeClass: string;
    bgClass: string;
    taskType: TaskType;
}

export function useTaskTypeItems(): Record<TaskTypeKey, TranslatedItemConfig> {
    const { t } = useTranslation();

    return useMemo(() => {
        const result = {} as Record<TaskTypeKey, TranslatedItemConfig>;
        for (const key of Object.keys(BASE_ITEMS) as TaskTypeKey[]) {
            result[key] = {
                ...BASE_ITEMS[key],
                label: t(TASK_TYPE_I18N_KEYS[key]),
            };
        }
        return result;
    }, [t]);
}
