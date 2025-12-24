import { getTaskTypeFromKey, type TaskTypeKey } from "./task-type-items";

export function createTaskFormData(
    taskId: string,
    taskType: TaskTypeKey,
    color: string,
    scheduledAt?: Date,
): FormData {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("task_type", String(getTaskTypeFromKey(taskType)));
    formData.append("color", color);
    if (scheduledAt) {
        formData.append("scheduled_at", scheduledAt.toISOString());
    }
    return formData;
}
