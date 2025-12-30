import { create } from "@bufbuild/protobuf";
import { GetTaskRequestSchema } from "~/gen/task/v1/task_pb";
import { withMockErrorContext } from "~/lib/mock-wrapper.server";
import { createAuthContext } from "~/lib/request-context.server";
import type { SerializableTask } from "./list-active-tasks.server";
import { taskLogger } from "./logger.server";
import { getTaskClient } from "./task-client.server";

export interface GetTaskResult {
    task?: SerializableTask;
    error?: string;
}

export async function getTask(
    request: Request,
    taskId: string,
): Promise<GetTaskResult> {
    return withMockErrorContext(request, async () => {
        const { contextValues, sessionToken } =
            await createAuthContext(request);

        if (!sessionToken) {
            taskLogger.warn("GetTask called without session token");
            return { error: "Unauthorized" };
        }

        try {
            const getTaskRequest = create(GetTaskRequestSchema, {
                taskId: taskId,
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.getTask(getTaskRequest, {
                contextValues,
            });

            if (!response.task) {
                return { error: "Task not found" };
            }

            taskLogger.info({ taskId }, "GetTask completed successfully");

            return {
                task: {
                    taskId: response.task.taskId,
                    taskType: response.task.taskType,
                    taskStatus: response.task.taskStatus,
                    title: response.task.title,
                    description: response.task.description,
                    scheduledAt: response.task.scheduledAt
                        ? {
                              seconds:
                                  response.task.scheduledAt.seconds.toString(),
                          }
                        : undefined,
                    createdAt: response.task.createdAt
                        ? {
                              seconds:
                                  response.task.createdAt.seconds.toString(),
                          }
                        : undefined,
                    targetAt: response.task.targetAt
                        ? {
                              seconds:
                                  response.task.targetAt.seconds.toString(),
                          }
                        : undefined,
                    color: response.task.color,
                },
            };
        } catch (err) {
            taskLogger.error({ err, taskId }, "GetTask failed");
            return {
                error:
                    err instanceof Error ? err.message : "Failed to get task",
            };
        }
    });
}
