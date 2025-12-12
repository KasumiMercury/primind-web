import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { data } from "react-router";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { TaskStatus, UpdateTaskRequestSchema } from "~/gen/task/v1/task_pb";
import { withRequestErrorContext } from "~/lib/mock-error-injection.server";
import { createAuthContext } from "~/lib/request-context.server";
import { taskLogger } from "~/task/logger.server";
import { getTaskClient } from "~/task/task-client.server";

export async function updateTaskAction(request: Request) {
    return withRequestErrorContext(request, async () => {
        const { contextValues, sessionToken } =
            await createAuthContext(request);

        if (!sessionToken) {
            taskLogger.warn("UpdateTask action called without session token");
            return data({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const taskId = formData.get("task_id");
        const title = formData.get("title");
        const description = formData.get("description");
        const taskStatusRaw = formData.get("task_status");
        const scheduledAtRaw = formData.get("scheduled_at");
        const color = formData.get("color");
        const updateMaskValues = formData.getAll("update_mask[]");

        try {
            taskLogger.debug(
                {
                    taskId,
                    title,
                    description,
                    taskStatusRaw,
                    color,
                    updateMaskValues,
                },
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

            if (updateMaskValues.length === 0) {
                taskLogger.warn("UpdateTask action received empty update_mask");
                throw new Error("update_mask is required");
            }

            const updateMaskPaths: string[] = [];
            for (const value of updateMaskValues) {
                if (typeof value !== "string") {
                    taskLogger.warn(
                        { value },
                        "UpdateTask action received invalid update_mask value",
                    );
                    throw new Error("Invalid update_mask value");
                }
                updateMaskPaths.push(value);
            }

            let taskStatus: TaskStatus | undefined;
            if (taskStatusRaw !== null) {
                if (typeof taskStatusRaw !== "string") {
                    taskLogger.warn(
                        { taskStatus: taskStatusRaw },
                        "UpdateTask action received invalid task status",
                    );
                    throw new Error("Invalid task status");
                }

                const parsedStatus = Number.parseInt(taskStatusRaw, 10);
                if (!Number.isFinite(parsedStatus)) {
                    taskLogger.warn(
                        { taskStatus: taskStatusRaw },
                        "UpdateTask action received non-numeric task status",
                    );
                    throw new Error("Task status must be a number");
                }

                if (
                    ![TaskStatus.ACTIVE, TaskStatus.COMPLETED].includes(
                        parsedStatus,
                    )
                ) {
                    taskLogger.warn(
                        { taskStatus: parsedStatus },
                        "UpdateTask action received invalid task status enum value",
                    );
                    throw new Error("Invalid task status value");
                }

                taskStatus = parsedStatus as TaskStatus;
            }

            let scheduledAt: Date | undefined;
            if (scheduledAtRaw !== null && scheduledAtRaw !== "") {
                if (typeof scheduledAtRaw !== "string") {
                    taskLogger.warn(
                        { scheduledAt: scheduledAtRaw },
                        "UpdateTask action received invalid scheduled_at",
                    );
                    throw new Error("Invalid scheduled_at");
                }

                const parsedDate = new Date(scheduledAtRaw);
                if (Number.isNaN(parsedDate.getTime())) {
                    taskLogger.warn(
                        { scheduledAt: scheduledAtRaw },
                        "UpdateTask action received invalid scheduled_at date format",
                    );
                    throw new Error("Invalid scheduled_at date format");
                }

                scheduledAt = parsedDate;
            }

            let validatedColor: string | undefined;
            if (color !== null) {
                if (typeof color !== "string") {
                    taskLogger.warn(
                        { color },
                        "UpdateTask action received invalid color",
                    );
                    throw new Error("Invalid color");
                }

                const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
                if (!hexColorRegex.test(color)) {
                    taskLogger.warn(
                        { color },
                        "UpdateTask action received invalid hex color format",
                    );
                    throw new Error("Invalid color format");
                }

                validatedColor = color;
            }

            taskLogger.debug(
                {
                    taskId,
                    taskStatus,
                    title,
                    description,
                    scheduledAt,
                    color: validatedColor,
                    updateMaskPaths,
                },
                "Updating task",
            );

            const updateRequest = create(UpdateTaskRequestSchema, {
                taskId: taskId,
                taskStatus: taskStatus ?? TaskStatus.UNSPECIFIED,
                title: typeof title === "string" ? title : "",
                description: typeof description === "string" ? description : "",
                scheduledAt: scheduledAt
                    ? timestampFromDate(scheduledAt)
                    : undefined,
                color: validatedColor ?? "",
                updateMask: { paths: updateMaskPaths },
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.updateTask(updateRequest, {
                contextValues,
            });

            taskLogger.info(
                {
                    taskId: response.task?.taskId,
                    updatedFields: updateMaskPaths,
                },
                "Task updated successfully",
            );

            return data(
                { success: true, taskId: response.task?.taskId },
                { status: 200 },
            );
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
    });
}
