export function createUpdateTaskFormData(
    taskId: string,
    title: string,
    description: string,
): FormData {
    const formData = new FormData();
    formData.append("task_id", taskId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("update_mask[]", "title");
    formData.append("update_mask[]", "description");
    return formData;
}

export function createDeleteTaskFormData(
    taskId: string,
    options?: { redirectTo?: string },
): FormData {
    const formData = new FormData();
    formData.append("task_id", taskId);
    if (options?.redirectTo) {
        formData.append("redirect_to", options.redirectTo);
    }
    return formData;
}
