export function createUpdateTaskFormData(
    taskId: string,
    title: string,
    description: string,
): FormData {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("title", title);
    formData.append("description", description);
    return formData;
}

export function createDeleteTaskFormData(taskId: string): FormData {
    const formData = new FormData();
    formData.append("task_id", taskId);
    return formData;
}
