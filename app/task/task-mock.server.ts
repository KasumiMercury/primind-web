import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { createRouterTransport } from "@connectrpc/connect";
import {
    CreateTaskResponseSchema,
    GetTaskResponseSchema,
    type Task,
    TaskSchema,
    TaskService,
    TaskStatus,
} from "~/gen/task/v1/task_pb";
import { taskLogger } from "~/task/logger.server";

const mockTasks = new Map<string, Task>();

export function createTaskMockTransport() {
    taskLogger.info("Creating mock TaskService transport");

    return createRouterTransport(({ service }) => {
        service(TaskService, {
            createTask: (req) => {
                taskLogger.debug(
                    {
                        taskId: req.taskId,
                        taskType: req.taskType,
                    },
                    "Mock: CreateTask called",
                );

                const taskId =
                    req.taskId ||
                    `mock-task-${Date.now()}-${Math.random().toString(36).substring(7)}`;

                const now = new Date();
                const createdAt = timestampFromDate(now);

                const task = create(TaskSchema, {
                    taskId: taskId,
                    taskType: req.taskType,
                    taskStatus: TaskStatus.ACTIVE,
                    title: req.title || "",
                    description: req.description || "",
                    scheduledAt: req.scheduledAt,
                    createdAt: createdAt,
                });

                mockTasks.set(taskId, task);

                taskLogger.info(
                    {
                        taskId: task.taskId,
                        taskType: task.taskType,
                        taskStatus: task.taskStatus,
                    },
                    "Mock: Task created",
                );

                return create(CreateTaskResponseSchema, {
                    task: task,
                });
            },

            getTask: (req) => {
                taskLogger.debug(
                    { taskId: req.taskId },
                    "Mock: GetTask called",
                );

                const task = mockTasks.get(req.taskId);

                if (!task) {
                    taskLogger.warn(
                        { taskId: req.taskId },
                        "Mock: Task not found",
                    );
                    throw new Error(`Task not found: ${req.taskId}`);
                }

                taskLogger.debug({ taskId: req.taskId }, "Mock: Task found");

                return create(GetTaskResponseSchema, {
                    task: task,
                });
            },
        });
    });
}
