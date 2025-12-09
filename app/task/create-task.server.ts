import { create } from "@bufbuild/protobuf";
import { data } from "react-router";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { CreateTaskRequestSchema, TaskType } from "~/gen/task/v1/task_pb";
import { createAuthContext } from "~/lib/request-context.server";
import { taskLogger } from "~/task/logger.server";
import { taskClient } from "~/task/task-client.server";

export async function createTaskAction(request: Request) {
    const { contextValues, sessionToken } = await createAuthContext(request);

    if (!sessionToken) {
        taskLogger.warn("CreateTask action called without session token");
        return data({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const taskId = formData.get("task_id");
    const taskTypeRaw = formData.get("task_type");

    try {
        taskLogger.debug(
            { taskTypeRaw },
            "CreateTask action received task type",
        );

        if (typeof taskId !== "string") {
            taskLogger.warn(
                { taskId: taskId },
                "CreateTask action received invalid task ID",
            );
            throw new Error("Invalid task ID");
        }

        if (!uuidValidate(taskId) || uuidVersion(taskId) !== 7) {
            taskLogger.warn(
                { taskId: taskId },
                "CreateTask action received invalid UUIDv7 task ID",
            );
            throw new Error("Invalid task ID");
        }

        taskLogger.debug({ taskId: taskId }, "Creating task with valid ID");

        if (typeof taskTypeRaw !== "string") {
            taskLogger.warn(
                { taskType: taskTypeRaw },
                "CreateTask action received invalid task type",
            );
            throw new Error("Invalid task type");
        }

        const taskType = Number.parseInt(taskTypeRaw, 10);
        if (!Number.isFinite(taskType)) {
            taskLogger.warn(
                { taskType: taskTypeRaw },
                "CreateTask action received non-numeric task type",
            );
            throw new Error("Task type must be a number");
        }

        if (
            ![
                TaskType.URGENT,
                TaskType.NORMAL,
                TaskType.LOW,
                TaskType.SCHEDULED,
            ].includes(taskType)
        ) {
            taskLogger.warn(
                { taskType },
                "CreateTask action received invalid task type enum value",
            );
            throw new Error("Invalid task type value");
        }

        taskLogger.debug({ taskType }, "Creating task");

        const createRequest = create(CreateTaskRequestSchema, {
            taskId: taskId,
            taskType: taskType as TaskType,
            title: "",
            description: "",
        });

        const response = await taskClient.createTask(createRequest, {
            contextValues,
        });

        taskLogger.info(
            { taskId: response.task?.taskId, taskType },
            "Task created successfully",
        );

        return data(
            { success: true, taskId: response.task?.taskId },
            { status: 200 },
        );
    } catch (err) {
        taskLogger.error(
            { err, taskType: taskTypeRaw },
            "CreateTask action failed",
        );
        return data(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to create task",
            },
            { status: 400 },
        );
    }
}
