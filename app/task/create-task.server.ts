import { create } from "@bufbuild/protobuf";
import { data } from "react-router";
import { CreateTaskRequestSchema, TaskType } from "~/gen/task/v1/task_pb";
import { taskLogger } from "~/task/logger.server";
import { taskClient } from "~/task/task-client.server";

export async function createTaskAction(request: Request) {
    const formData = await request.formData();
    const taskTypeRaw = formData.get("task_type");

    try {
        taskLogger.debug(
            { taskTypeRaw },
            "CreateTask action received task type",
        );

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
                TaskType.HAS_DUE_TIME,
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
            taskType: taskType as TaskType,
            title: "",
            description: "",
        });

        const response = await taskClient.createTask(createRequest);

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
