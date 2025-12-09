import { create } from "@bufbuild/protobuf";
import {
    ListActiveTasksRequestSchema,
    type Task,
    TaskSortType,
    type TaskStatus,
    type TaskType,
} from "~/gen/task/v1/task_pb";
import { createAuthContext } from "~/lib/request-context.server";
import { taskLogger } from "~/task/logger.server";
import { taskClient } from "~/task/task-client.server";

export interface SerializableTimestamp {
    seconds: string;
}

export interface SerializableTask {
    taskId: string;
    taskType: TaskType;
    taskStatus: TaskStatus;
    title: string;
    description: string;
    scheduledAt?: SerializableTimestamp;
    createdAt?: SerializableTimestamp;
    targetAt?: SerializableTimestamp;
}

function serializeTask(task: Task): SerializableTask {
    return {
        taskId: task.taskId,
        taskType: task.taskType,
        taskStatus: task.taskStatus,
        title: task.title,
        description: task.description,
        scheduledAt: task.scheduledAt
            ? { seconds: task.scheduledAt.seconds.toString() }
            : undefined,
        createdAt: task.createdAt
            ? { seconds: task.createdAt.seconds.toString() }
            : undefined,
        targetAt: task.targetAt
            ? { seconds: task.targetAt.seconds.toString() }
            : undefined,
    };
}

export interface ActiveTasksResult {
    tasks: SerializableTask[];
    error?: string;
}

export async function listActiveTasks(
    request: Request,
): Promise<ActiveTasksResult> {
    const { contextValues, sessionToken } = await createAuthContext(request);

    if (!sessionToken) {
        taskLogger.warn("ListActiveTasks called without session token");
        return { tasks: [], error: "Unauthorized" };
    }

    try {
        const listRequest = create(ListActiveTasksRequestSchema, {
            sortType: TaskSortType.TARGET_AT,
        });

        const response = await taskClient.listActiveTasks(listRequest, {
            contextValues,
        });

        taskLogger.info(
            { count: response.tasks.length },
            "ListActiveTasks completed successfully",
        );

        return { tasks: response.tasks.map(serializeTask) };
    } catch (err) {
        taskLogger.error({ err }, "ListActiveTasks failed");
        return {
            tasks: [],
            error: err instanceof Error ? err.message : "Failed to list tasks",
        };
    }
}
