import { data } from "react-router";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { taskLogger } from "~/task/logger.server";

export async function deleteTaskAction(request: Request) {
    const formData = await request.formData();
    const taskId = formData.get("task_id");

    try {
        taskLogger.debug({ taskId }, "DeleteTask action received");

        if (typeof taskId !== "string") {
            taskLogger.warn(
                { taskId },
                "DeleteTask action received invalid task ID",
            );
            throw new Error("Invalid task ID");
        }

        if (!uuidValidate(taskId) || uuidVersion(taskId) !== 7) {
            taskLogger.warn(
                { taskId },
                "DeleteTask action received invalid UUIDv7 task ID",
            );
            throw new Error("Invalid task ID");
        }

        taskLogger.info({ taskId }, "DeleteTask action completed");

        // TODO: Implement actual task deletion logic
        return data(
            { success: true, taskId, message: "Delete logged" },
            { status: 200 },
        );
    } catch (err) {
        taskLogger.error({ err, taskId }, "DeleteTask action failed");
        return data(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete task",
            },
            { status: 400 },
        );
    }
}
