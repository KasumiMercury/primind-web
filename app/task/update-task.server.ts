import { data } from "react-router";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { taskLogger } from "~/task/logger.server";

export async function updateTaskAction(request: Request) {
    const formData = await request.formData();
    const taskId = formData.get("task_id");
    const title = formData.get("title");
    const description = formData.get("description");

    try {
        taskLogger.debug(
            { taskId, title, description },
            "UpdateTask action received",
        );

        if (typeof taskId !== "string") {
            taskLogger.warn(
                { taskId },
                "UpdateTask action received invalid task ID",
            );
            throw new Error("Invalid task ID");
        }

        if (!uuidValidate(taskId) || uuidVersion(taskId) !== 7) {
            taskLogger.warn(
                { taskId },
                "UpdateTask action received invalid UUIDv7 task ID",
            );
            throw new Error("Invalid task ID");
        }

        if (typeof title !== "string") {
            taskLogger.warn(
                { title },
                "UpdateTask action received invalid title",
            );
            throw new Error("Invalid title");
        }

        if (typeof description !== "string") {
            taskLogger.warn(
                { description },
                "UpdateTask action received invalid description",
            );
            throw new Error("Invalid description");
        }

        // TODO: implement the actual update logic
        taskLogger.info(
            { taskId, title, description },
            "UpdateTask action completed",
        );

        return data({ success: true, taskId }, { status: 200 });
    } catch (err) {
        taskLogger.error({ err, taskId }, "UpdateTask action failed");
        return data(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to update task",
            },
            { status: 400 },
        );
    }
}
