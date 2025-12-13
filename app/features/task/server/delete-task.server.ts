import { create } from "@bufbuild/protobuf";
import { data, redirect } from "react-router";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { DeleteTaskRequestSchema } from "~/gen/task/v1/task_pb";
import { withRequestErrorContext } from "~/lib/mock-error-injection.server";
import { createAuthContext } from "~/lib/request-context.server";
import { taskLogger } from "./logger.server";
import { getTaskClient } from "./task-client.server";

export async function deleteTaskAction(request: Request) {
    return withRequestErrorContext(request, async () => {
        const { contextValues, sessionToken } =
            await createAuthContext(request);

        if (!sessionToken) {
            taskLogger.warn("DeleteTask action called without session token");
            return data({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const taskId = formData.get("task_id");
        const redirectTo = formData.get("redirect_to");

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

            const deleteRequest = create(DeleteTaskRequestSchema, {
                taskId: taskId,
            });

            const taskClient = await getTaskClient();
            await taskClient.deleteTask(deleteRequest, { contextValues });

            taskLogger.info({ taskId }, "DeleteTask action completed");

            if (typeof redirectTo === "string") {
                const target = redirectTo.startsWith("/")
                    ? redirectTo
                    : "/";
                return redirect(target);
            }

            return data({ success: true });
        } catch (err) {
            taskLogger.error({ err, taskId }, "DeleteTask action failed");
            const isValidationError =
                err instanceof Error && err.message === "Invalid task ID";
            return data(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to delete task",
                },
                { status: isValidationError ? 400 : 500 },
            );
        }
    });
}
