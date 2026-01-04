import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";
import { orpc } from "~/orpc/client";
import type { CreateTaskInput, UpdateTaskInput } from "~/orpc/schemas/task";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { getTaskDB } from "./db.client";
import type { LocalTask, TaskOperationResult } from "./types";

export interface TaskService {
    create(
        input: CreateTaskInput,
    ): Promise<TaskOperationResult<{ taskId: string }>>;
    get(
        taskId: string,
    ): Promise<TaskOperationResult<{ task?: SerializableTask }>>;
    update(
        input: UpdateTaskInput,
    ): Promise<TaskOperationResult<{ taskId: string }>>;
    delete(taskId: string): Promise<TaskOperationResult<{ success: boolean }>>;
    listActive(): Promise<TaskOperationResult<{ tasks: SerializableTask[] }>>;
}

export function createTaskService(isAuthenticated: boolean): TaskService {
    if (isAuthenticated) {
        return createServerTaskService();
    }
    return createLocalTaskService();
}

// use at local task creation
// for demonstration purposes only
function calculateTargetAt(
    taskType: TaskType,
    scheduledAt?: string,
): Date | undefined {
    const now = new Date();

    switch (taskType) {
        case TaskType.SHORT:
            return new Date(now.getTime() + 30 * 60 * 1000);
        case TaskType.NEAR:
            return new Date(now.getTime() + 2 * 60 * 60 * 1000);
        case TaskType.RELAXED:
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case TaskType.SCHEDULED:
            return scheduledAt ? new Date(scheduledAt) : undefined;
        default:
            return undefined;
    }
}

/**
 * Server task service using oRPC.
 */
function createServerTaskService(): TaskService {
    return {
        async create(input) {
            try {
                const result = await orpc.task.create(input);
                return {
                    data: { taskId: result.taskId ?? "" },
                    isLocalOperation: false,
                    error: result.error,
                };
            } catch (err) {
                return {
                    data: { taskId: "" },
                    isLocalOperation: false,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to create task",
                };
            }
        },

        async get(taskId) {
            try {
                const result = await orpc.task.get({ taskId });
                return {
                    data: { task: result.task as SerializableTask | undefined },
                    isLocalOperation: false,
                    error: result.error,
                };
            } catch (err) {
                return {
                    data: { task: undefined },
                    isLocalOperation: false,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to get task",
                };
            }
        },

        async update(input) {
            try {
                const result = await orpc.task.update(input);
                return {
                    data: { taskId: result.taskId ?? "" },
                    isLocalOperation: false,
                    error: result.error,
                };
            } catch (err) {
                return {
                    data: { taskId: "" },
                    isLocalOperation: false,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to update task",
                };
            }
        },

        async delete(taskId) {
            try {
                const result = await orpc.task.delete({ taskId });
                return {
                    data: { success: result.success },
                    isLocalOperation: false,
                    error: result.error,
                };
            } catch (err) {
                return {
                    data: { success: false },
                    isLocalOperation: false,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to delete task",
                };
            }
        },

        async listActive() {
            try {
                const result = await orpc.task.listActive();
                return {
                    data: { tasks: result.tasks as SerializableTask[] },
                    isLocalOperation: false,
                    error: result.error,
                };
            } catch (err) {
                return {
                    data: { tasks: [] },
                    isLocalOperation: false,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to list tasks",
                };
            }
        },
    };
}

function createLocalTaskService(): TaskService {
    return {
        async create(input) {
            try {
                const db = getTaskDB();
                if (!db) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: "Local storage not available",
                    };
                }

                const targetAt = calculateTargetAt(
                    input.taskType,
                    input.scheduledAt,
                );

                const now = new Date().toISOString();
                const localTask: LocalTask = {
                    taskId: input.taskId,
                    taskType: input.taskType,
                    taskStatus: TaskStatus.ACTIVE,
                    title: "",
                    description: "",
                    color: input.color,
                    scheduledAt: input.scheduledAt
                        ? {
                              seconds: Math.floor(
                                  new Date(input.scheduledAt).getTime() / 1000,
                              ).toString(),
                          }
                        : undefined,
                    targetAt: targetAt
                        ? {
                              seconds: Math.floor(
                                  targetAt.getTime() / 1000,
                              ).toString(),
                          }
                        : undefined,
                    createdAt: {
                        seconds: Math.floor(Date.now() / 1000).toString(),
                    },
                    _localCreatedAt: now,
                    _localUpdatedAt: now,
                    _syncStatus: "pending",
                };

                await db.tasks.add(localTask);

                return {
                    data: { taskId: localTask.taskId },
                    isLocalOperation: true,
                };
            } catch (err) {
                return {
                    data: { taskId: "" },
                    isLocalOperation: true,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to create task locally",
                };
            }
        },

        async get(taskId) {
            try {
                const db = getTaskDB();
                if (!db) {
                    return {
                        data: { task: undefined },
                        isLocalOperation: true,
                        error: "Local storage not available",
                    };
                }

                const task = await db.tasks.get(taskId);
                return {
                    data: { task },
                    isLocalOperation: true,
                };
            } catch (err) {
                return {
                    data: { task: undefined },
                    isLocalOperation: true,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to get task locally",
                };
            }
        },

        async update(input) {
            try {
                const db = getTaskDB();
                if (!db) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: "Local storage not available",
                    };
                }

                const existing = await db.tasks.get(input.taskId);
                if (!existing) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: "Task not found",
                    };
                }

                const updates: Partial<LocalTask> = {
                    _localUpdatedAt: new Date().toISOString(),
                    _syncStatus: "pending",
                };

                // Apply updates based on updateMask
                for (const field of input.updateMask) {
                    switch (field) {
                        case "title":
                            if (input.title !== undefined) {
                                updates.title = input.title;
                            }
                            break;
                        case "description":
                            if (input.description !== undefined) {
                                updates.description = input.description;
                            }
                            break;
                        case "task_status":
                            if (input.taskStatus !== undefined) {
                                updates.taskStatus = input.taskStatus;
                            }
                            break;
                        case "color":
                            if (input.color !== undefined) {
                                updates.color = input.color;
                            }
                            break;
                        case "scheduled_at":
                            if (input.scheduledAt !== undefined) {
                                updates.scheduledAt = {
                                    seconds: Math.floor(
                                        new Date(input.scheduledAt).getTime() /
                                            1000,
                                    ).toString(),
                                };
                            }
                            break;
                    }
                }

                await db.tasks.update(input.taskId, updates);

                return {
                    data: { taskId: input.taskId },
                    isLocalOperation: true,
                };
            } catch (err) {
                return {
                    data: { taskId: "" },
                    isLocalOperation: true,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to update task locally",
                };
            }
        },

        async delete(taskId) {
            try {
                const db = getTaskDB();
                if (!db) {
                    return {
                        data: { success: false },
                        isLocalOperation: true,
                        error: "Local storage not available",
                    };
                }

                await db.tasks.delete(taskId);
                return {
                    data: { success: true },
                    isLocalOperation: true,
                };
            } catch (err) {
                return {
                    data: { success: false },
                    isLocalOperation: true,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to delete task locally",
                };
            }
        },

        async listActive() {
            try {
                const db = getTaskDB();
                if (!db) {
                    return {
                        data: { tasks: [] },
                        isLocalOperation: true,
                        error: "Local storage not available",
                    };
                }

                const tasks = await db.tasks
                    .where("taskStatus")
                    .equals(TaskStatus.ACTIVE)
                    .sortBy("targetAt.seconds");

                return {
                    data: { tasks },
                    isLocalOperation: true,
                };
            } catch (err) {
                return {
                    data: { tasks: [] },
                    isLocalOperation: true,
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to list tasks locally",
                };
            }
        },
    };
}
