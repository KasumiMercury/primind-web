import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError, createRouterTransport } from "@connectrpc/connect";
import {
    CreateTaskResponseSchema,
    GetTaskResponseSchema,
    ListActiveTasksResponseSchema,
    type Task,
    TaskSchema,
    TaskService,
    TaskSortType,
    TaskStatus,
    UpdateTaskResponseSchema,
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
                        color: req.color,
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
                    color: req.color,
                });

                mockTasks.set(taskId, task);

                taskLogger.info(
                    {
                        taskId: task.taskId,
                        taskType: task.taskType,
                        taskStatus: task.taskStatus,
                        color: task.color,
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
                    throw new ConnectError(
                        `Task not found: ${req.taskId}`,
                        Code.NotFound,
                    );
                }

                taskLogger.debug({ taskId: req.taskId }, "Mock: Task found");

                return create(GetTaskResponseSchema, {
                    task: task,
                });
            },

            listActiveTasks: (req) => {
                taskLogger.debug(
                    { sortType: req.sortType },
                    "Mock: ListActiveTasks called",
                );

                const activeTasks = Array.from(mockTasks.values()).filter(
                    (task) => task.taskStatus === TaskStatus.ACTIVE,
                );

                if (req.sortType === TaskSortType.TARGET_AT) {
                    activeTasks.sort((a, b) => {
                        const aTime = a.targetAt?.seconds ?? BigInt(0);
                        const bTime = b.targetAt?.seconds ?? BigInt(0);
                        if (aTime < bTime) return -1;
                        if (aTime > bTime) return 1;
                        return 0;
                    });
                }

                taskLogger.info(
                    { count: activeTasks.length, sortType: req.sortType },
                    "Mock: ListActiveTasks returning tasks",
                );

                return create(ListActiveTasksResponseSchema, {
                    tasks: activeTasks,
                });
            },

            updateTask: (req) => {
                taskLogger.debug(
                    {
                        taskId: req.taskId,
                        updateMask: req.updateMask?.paths,
                    },
                    "Mock: UpdateTask called",
                );

                const existingTask = mockTasks.get(req.taskId);

                if (!existingTask) {
                    taskLogger.warn(
                        { taskId: req.taskId },
                        "Mock: Task not found for update",
                    );
                    throw new ConnectError(
                        `Task not found: ${req.taskId}`,
                        Code.NotFound,
                    );
                }

                const updatedTask = create(TaskSchema, { ...existingTask });
                const paths = req.updateMask?.paths ?? [];

                for (const path of paths) {
                    switch (path) {
                        case "task_status":
                            updatedTask.taskStatus = req.taskStatus;
                            break;
                        case "title":
                            updatedTask.title = req.title;
                            break;
                        case "description":
                            updatedTask.description = req.description;
                            break;
                        case "scheduled_at":
                            updatedTask.scheduledAt = req.scheduledAt;
                            break;
                        case "color":
                            updatedTask.color = req.color;
                            break;
                        default:
                            taskLogger.warn(
                                { path },
                                "Mock: Unknown field in update_mask",
                            );
                    }
                }

                mockTasks.set(req.taskId, updatedTask);

                taskLogger.info(
                    {
                        taskId: updatedTask.taskId,
                        updatedFields: paths,
                    },
                    "Mock: Task updated",
                );

                return create(UpdateTaskResponseSchema, {
                    task: updatedTask,
                });
            },
        });
    });
}
