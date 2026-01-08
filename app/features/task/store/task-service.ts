import { ORPCError } from "@orpc/client";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";
import { ERROR_CODES } from "~/lib/errors";
import { orpc } from "~/orpc/client";
import type { CreateTaskInput, UpdateTaskInput } from "~/orpc/schemas/task";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { getTaskDB } from "./db.client";
import type { LocalTask, TaskOperationResult } from "./types";

function isUnauthorizedError(
    err: unknown,
): err is ORPCError<"UNAUTHORIZED", unknown> {
    return err instanceof ORPCError && err.code === "UNAUTHORIZED";
}

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
                if (isUnauthorizedError(err)) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: false,
                        error: ERROR_CODES.AUTH_SESSION_INVALID,
                        sessionInvalid: true,
                    };
                }
                return {
                    data: { taskId: "" },
                    isLocalOperation: false,
                    error: ERROR_CODES.TASK_CREATE_FAILED,
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
                if (isUnauthorizedError(err)) {
                    return {
                        data: { task: undefined },
                        isLocalOperation: false,
                        error: ERROR_CODES.AUTH_SESSION_INVALID,
                        sessionInvalid: true,
                    };
                }
                return {
                    data: { task: undefined },
                    isLocalOperation: false,
                    error: ERROR_CODES.TASK_GET_FAILED,
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
                if (isUnauthorizedError(err)) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: false,
                        error: ERROR_CODES.AUTH_SESSION_INVALID,
                        sessionInvalid: true,
                    };
                }
                return {
                    data: { taskId: "" },
                    isLocalOperation: false,
                    error: ERROR_CODES.TASK_UPDATE_FAILED,
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
                if (isUnauthorizedError(err)) {
                    return {
                        data: { success: false },
                        isLocalOperation: false,
                        error: ERROR_CODES.AUTH_SESSION_INVALID,
                        sessionInvalid: true,
                    };
                }
                return {
                    data: { success: false },
                    isLocalOperation: false,
                    error: ERROR_CODES.TASK_DELETE_FAILED,
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
                if (isUnauthorizedError(err)) {
                    return {
                        data: { tasks: [] },
                        isLocalOperation: false,
                        error: ERROR_CODES.AUTH_SESSION_INVALID,
                        sessionInvalid: true,
                    };
                }
                return {
                    data: { tasks: [] },
                    isLocalOperation: false,
                    error: ERROR_CODES.TASK_LIST_FAILED,
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
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
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
            } catch {
                return {
                    data: { taskId: "" },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_CREATE_FAILED,
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
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                    };
                }

                const task = await db.tasks.get(taskId);
                return {
                    data: { task },
                    isLocalOperation: true,
                };
            } catch {
                return {
                    data: { task: undefined },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_GET_FAILED,
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
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                    };
                }

                const existing = await db.tasks.get(input.taskId);
                if (!existing) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: ERROR_CODES.TASK_NOT_FOUND,
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
                    }
                }

                await db.tasks.update(input.taskId, updates);

                return {
                    data: { taskId: input.taskId },
                    isLocalOperation: true,
                };
            } catch {
                return {
                    data: { taskId: "" },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_UPDATE_FAILED,
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
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                    };
                }

                await db.tasks.delete(taskId);
                return {
                    data: { success: true },
                    isLocalOperation: true,
                };
            } catch {
                return {
                    data: { success: false },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_DELETE_FAILED,
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
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                    };
                }

                const tasks = await db.tasks
                    .where("taskStatus")
                    .equals(TaskStatus.ACTIVE)
                    .toArray();

                tasks.sort(
                    (a, b) =>
                        Number(a.targetAt?.seconds ?? Infinity) -
                        Number(b.targetAt?.seconds ?? Infinity),
                );

                return {
                    data: { tasks },
                    isLocalOperation: true,
                };
            } catch {
                return {
                    data: { tasks: [] },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_LIST_FAILED,
                };
            }
        },
    };
}
