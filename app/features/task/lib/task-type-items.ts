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
    URGENT: "urgent",
    NORMAL: "normal",
    LOW: "low",
    SCHEDULED: "duetime",
} as const;

export type TaskTypeKey = (typeof TASK_TYPE_KEYS)[keyof typeof TASK_TYPE_KEYS];

interface ItemConfig {
    icon: IconComponent;
    label: string;
    className: string;
    taskType: TaskType;
}

export const ITEMS = {
    [TASK_TYPE_KEYS.URGENT]: {
        icon: StarBurstIcon,
        label: "Urgent",
        className: "stroke-red-500",
        taskType: TaskType.URGENT,
    },
    [TASK_TYPE_KEYS.NORMAL]: {
        icon: CircleIcon,
        label: "Normal",
        className: "stroke-blue-500",
        taskType: TaskType.NORMAL,
    },
    [TASK_TYPE_KEYS.LOW]: {
        icon: PillIcon,
        label: "Low",
        className: "stroke-green-500",
        taskType: TaskType.LOW,
    },
    [TASK_TYPE_KEYS.SCHEDULED]: {
        icon: RectangleIcon,
        label: "Due Time",
        className: "stroke-yellow-500",
        taskType: TaskType.SCHEDULED,
    },
} satisfies Record<TaskTypeKey, ItemConfig>;

export function getTaskTypeFromKey(key: TaskTypeKey): TaskType {
    return ITEMS[key].taskType;
}
