import { getTaskTypeFromKey, type TaskTypeKey } from "./task-type-items";

export function createTaskFormData(
    taskId: string,
    taskType: TaskTypeKey,
): FormData {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("task_type", String(getTaskTypeFromKey(taskType)));
    return formData;
}
