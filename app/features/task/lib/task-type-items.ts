import type { ComponentType } from "react";
import { TaskType } from "~/gen/task/v1/task_pb";
import { CircleIcon } from "../icons/circle-icon";
import { PillIcon } from "../icons/pill-icon";
import { RectangleIcon } from "../icons/rectangle-icon";
import { StarBurstIcon } from "../icons/starburst-icon";

export type IconComponent = ComponentType<{
    className?: string;
    label: string;
    showLabel?: boolean;
    fillColor?: string;
}>;

export const TASK_TYPE_KEYS = {
    SHORT: "short",
    NEAR: "near",
    RELAXED: "relaxed",
    SCHEDULED: "scheduled",
} as const;

export type TaskTypeKey = (typeof TASK_TYPE_KEYS)[keyof typeof TASK_TYPE_KEYS];

interface BaseItemConfig {
    icon: IconComponent;
    className: string;
    taskType: TaskType;
}

export const BASE_ITEMS: Record<TaskTypeKey, BaseItemConfig> = {
    [TASK_TYPE_KEYS.SHORT]: {
        icon: StarBurstIcon,
        className: "stroke-red-500",
        taskType: TaskType.SHORT,
    },
    [TASK_TYPE_KEYS.NEAR]: {
        icon: CircleIcon,
        className: "stroke-blue-500",
        taskType: TaskType.NEAR,
    },
    [TASK_TYPE_KEYS.RELAXED]: {
        icon: PillIcon,
        className: "stroke-green-500",
        taskType: TaskType.RELAXED,
    },
    [TASK_TYPE_KEYS.SCHEDULED]: {
        icon: RectangleIcon,
        className: "stroke-yellow-500",
        taskType: TaskType.SCHEDULED,
    },
};

export const TASK_TYPE_I18N_KEYS = {
    [TASK_TYPE_KEYS.SHORT]: "taskType.short",
    [TASK_TYPE_KEYS.NEAR]: "taskType.near",
    [TASK_TYPE_KEYS.RELAXED]: "taskType.relaxed",
    [TASK_TYPE_KEYS.SCHEDULED]: "taskType.scheduled",
} as const;

export function getTaskTypeFromKey(key: TaskTypeKey): TaskType {
    return BASE_ITEMS[key].taskType;
}
