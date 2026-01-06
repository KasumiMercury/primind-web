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
    strokeWidth?: number;
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
    strokeClass: string;
    bgClass: string;
    taskType: TaskType;
}

export const BASE_ITEMS: Record<TaskTypeKey, BaseItemConfig> = {
    [TASK_TYPE_KEYS.SHORT]: {
        icon: StarBurstIcon,
        strokeClass: "stroke-task-short",
        bgClass: "bg-task-short",
        taskType: TaskType.SHORT,
    },
    [TASK_TYPE_KEYS.NEAR]: {
        icon: CircleIcon,
        strokeClass: "stroke-task-near",
        bgClass: "bg-task-near",
        taskType: TaskType.NEAR,
    },
    [TASK_TYPE_KEYS.RELAXED]: {
        icon: PillIcon,
        strokeClass: "stroke-task-relaxed",
        bgClass: "bg-task-relaxed",
        taskType: TaskType.RELAXED,
    },
    [TASK_TYPE_KEYS.SCHEDULED]: {
        icon: RectangleIcon,
        strokeClass: "stroke-task-scheduled",
        bgClass: "bg-task-scheduled",
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
