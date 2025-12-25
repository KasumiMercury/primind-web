import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { MINIMUM_SCHEDULE_LEAD_TIME_MINUTES } from "~/features/task/constants";
import { taskLogger } from "~/features/task/server/logger.server";
import { getTaskClient } from "~/features/task/server/task-client.server";
import {
    CreateTaskRequestSchema,
    DeleteTaskRequestSchema,
    GetTaskRequestSchema,
    ListActiveTasksRequestSchema,
    type Task,
    TaskSortType,
    TaskStatus,
    type TaskType,
    UpdateTaskRequestSchema,
} from "~/gen/task/v1/task_pb";
import { authedProcedure } from "../middleware/auth";
import {
    createTaskInputSchema,
    createTaskOutputSchema,
    deleteTaskInputSchema,
    deleteTaskOutputSchema,
    getTaskInputSchema,
    getTaskOutputSchema,
    listActiveTasksOutputSchema,
    type TaskOutput,
    updateTaskInputSchema,
    updateTaskOutputSchema,
} from "../schemas/task";

function serializeTask(task: Task): TaskOutput {
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
        color: task.color,
    };
}

export const createTaskProcedure = authedProcedure
    .input(createTaskInputSchema)
    .output(createTaskOutputSchema)
    .handler(async ({ input, context }) => {
        try {
            let scheduledAt: Date | undefined;
            if (input.scheduledAt) {
                scheduledAt = new Date(input.scheduledAt);

                const truncateToMinute = (date: Date) => {
                    const d = new Date(date);
                    d.setSeconds(0, 0);
                    return d;
                };
                const normalizedScheduledAt = truncateToMinute(scheduledAt);
                const minimumTime = truncateToMinute(new Date());
                minimumTime.setMinutes(
                    minimumTime.getMinutes() +
                        MINIMUM_SCHEDULE_LEAD_TIME_MINUTES,
                );

                if (normalizedScheduledAt < minimumTime) {
                    taskLogger.warn(
                        { scheduledAt: input.scheduledAt },
                        `CreateTask received scheduled_at less than ${MINIMUM_SCHEDULE_LEAD_TIME_MINUTES} minutes from now`,
                    );
                    return {
                        success: false,
                        error: `Schedule time must be at least ${MINIMUM_SCHEDULE_LEAD_TIME_MINUTES} minutes from now`,
                    };
                }
            }

            taskLogger.debug(
                {
                    taskId: input.taskId,
                    taskType: input.taskType,
                    color: input.color,
                },
                "Creating task",
            );

            const createRequest = create(CreateTaskRequestSchema, {
                taskId: input.taskId,
                taskType: input.taskType as TaskType,
                title: "",
                description: "",
                color: input.color,
                scheduledAt: scheduledAt
                    ? timestampFromDate(scheduledAt)
                    : undefined,
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.createTask(createRequest, {
                contextValues: context.contextValues,
            });

            taskLogger.info(
                { taskId: response.task?.taskId, taskType: input.taskType },
                "Task created successfully",
            );

            return {
                success: true,
                taskId: response.task?.taskId,
            };
        } catch (err) {
            taskLogger.error(
                { err, taskId: input.taskId },
                "CreateTask failed",
            );
            return {
                success: false,
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to create task",
            };
        }
    });

export const updateTaskProcedure = authedProcedure
    .input(updateTaskInputSchema)
    .output(updateTaskOutputSchema)
    .handler(async ({ input, context }) => {
        try {
            let scheduledAt: Date | undefined;
            if (input.scheduledAt) {
                scheduledAt = new Date(input.scheduledAt);
            }

            taskLogger.debug(
                {
                    taskId: input.taskId,
                    title: input.title,
                    description: input.description,
                    taskStatus: input.taskStatus,
                    color: input.color,
                    updateMask: input.updateMask,
                },
                "Updating task",
            );

            const updateRequest = create(UpdateTaskRequestSchema, {
                taskId: input.taskId,
                taskStatus: input.taskStatus ?? TaskStatus.UNSPECIFIED,
                title: input.title ?? "",
                description: input.description ?? "",
                scheduledAt: scheduledAt
                    ? timestampFromDate(scheduledAt)
                    : undefined,
                color: input.color ?? "",
                updateMask: { paths: input.updateMask },
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.updateTask(updateRequest, {
                contextValues: context.contextValues,
            });

            taskLogger.info(
                {
                    taskId: response.task?.taskId,
                    updatedFields: input.updateMask,
                },
                "Task updated successfully",
            );

            return {
                success: true,
                taskId: response.task?.taskId,
            };
        } catch (err) {
            taskLogger.error(
                { err, taskId: input.taskId },
                "UpdateTask failed",
            );
            return {
                success: false,
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to update task",
            };
        }
    });

export const deleteTaskProcedure = authedProcedure
    .input(deleteTaskInputSchema)
    .output(deleteTaskOutputSchema)
    .handler(async ({ input, context }) => {
        try {
            taskLogger.debug({ taskId: input.taskId }, "Deleting task");

            const deleteRequest = create(DeleteTaskRequestSchema, {
                taskId: input.taskId,
            });

            const taskClient = await getTaskClient();
            await taskClient.deleteTask(deleteRequest, {
                contextValues: context.contextValues,
            });

            taskLogger.info(
                { taskId: input.taskId },
                "Task deleted successfully",
            );

            return { success: true };
        } catch (err) {
            taskLogger.error(
                { err, taskId: input.taskId },
                "DeleteTask failed",
            );
            return {
                success: false,
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to delete task",
            };
        }
    });

export const getTaskProcedure = authedProcedure
    .input(getTaskInputSchema)
    .output(getTaskOutputSchema)
    .handler(async ({ input, context }) => {
        try {
            const getTaskRequest = create(GetTaskRequestSchema, {
                taskId: input.taskId,
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.getTask(getTaskRequest, {
                contextValues: context.contextValues,
            });

            if (!response.task) {
                return { error: "Task not found" };
            }

            taskLogger.info(
                { taskId: input.taskId },
                "GetTask completed successfully",
            );

            return {
                task: serializeTask(response.task),
            };
        } catch (err) {
            taskLogger.error({ err, taskId: input.taskId }, "GetTask failed");
            return {
                error:
                    err instanceof Error ? err.message : "Failed to get task",
            };
        }
    });

export const listActiveTasksProcedure = authedProcedure
    .output(listActiveTasksOutputSchema)
    .handler(async ({ context }) => {
        try {
            const listRequest = create(ListActiveTasksRequestSchema, {
                sortType: TaskSortType.TARGET_AT,
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.listActiveTasks(listRequest, {
                contextValues: context.contextValues,
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
                error:
                    err instanceof Error ? err.message : "Failed to list tasks",
            };
        }
    });

export const taskRouter = {
    create: createTaskProcedure,
    update: updateTaskProcedure,
    delete: deleteTaskProcedure,
    get: getTaskProcedure,
    listActive: listActiveTasksProcedure,
};
