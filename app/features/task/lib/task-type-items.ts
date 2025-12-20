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

interface ItemConfig {
    icon: IconComponent;
    label: string;
    className: string;
    taskType: TaskType;
}

export const ITEMS = {
    [TASK_TYPE_KEYS.SHORT]: {
        icon: StarBurstIcon,
        label: "Soon",
        className: "stroke-red-500",
        taskType: TaskType.SHORT,
    },
    [TASK_TYPE_KEYS.NEAR]: {
        icon: CircleIcon,
        label: "Later",
        className: "stroke-blue-500",
        taskType: TaskType.NEAR,
    },
    [TASK_TYPE_KEYS.RELAXED]: {
        icon: PillIcon,
        label: "No rush",
        className: "stroke-green-500",
        taskType: TaskType.RELAXED,
    },
    [TASK_TYPE_KEYS.SCHEDULED]: {
        icon: RectangleIcon,
        label: "Schedule",
        className: "stroke-yellow-500",
        taskType: TaskType.SCHEDULED,
    },
} satisfies Record<TaskTypeKey, ItemConfig>;

export function getTaskTypeFromKey(key: TaskTypeKey): TaskType {
    return ITEMS[key].taskType;
}
