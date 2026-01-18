import { ORPCError } from "@orpc/client";
import { getNetworkStatus } from "~/hooks/use-network-status";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";
import { ERROR_CODES } from "~/lib/errors";
import { orpc } from "~/orpc/client";
import type { CreateTaskInput, UpdateTaskInput } from "~/orpc/schemas/task";
import type { SerializableTask } from "../server/list-active-tasks.server";
import { getTaskDB } from "./db.client";
import {
    clearOperationsForTask,
    queueCreateOperation,
    queueDeleteOperation,
    queueUpdateOperation,
} from "./operation-queue";
import type { LocalTask, TaskOperationResult } from "./types";

function isUnauthorizedError(
    err: unknown,
): err is ORPCError<"UNAUTHORIZED", unknown> {
    return err instanceof ORPCError && err.code === "UNAUTHORIZED";
}

function isNetworkError(err: unknown): boolean {
    if (err instanceof TypeError && err.message.includes("fetch")) {
        return true;
    }
    if (err instanceof Error && err.name === "NetworkError") {
        return true;
    }
    return false;
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
        return createOfflineAwareServerTaskService();
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
 * Store a task locally (for offline use)
 */
async function storeTaskLocally(
    input: CreateTaskInput,
    syncStatus: "pending" | "synced" = "pending",
): Promise<{ taskId: string } | null> {
    const db = getTaskDB();
    if (!db) return null;

    const targetAt = calculateTargetAt(input.taskType, input.scheduledAt);
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
                  seconds: Math.floor(targetAt.getTime() / 1000).toString(),
              }
            : undefined,
        createdAt: {
            seconds: Math.floor(Date.now() / 1000).toString(),
        },
        _localCreatedAt: now,
        _localUpdatedAt: now,
        _syncStatus: syncStatus,
    };

    await db.tasks.put(localTask);
    return { taskId: localTask.taskId };
}

/**
 * Update a task locally (for offline use)
 */
async function updateTaskLocally(
    input: UpdateTaskInput,
    syncStatus: "pending" | "synced" = "pending",
): Promise<{ taskId: string } | null> {
    const db = getTaskDB();
    if (!db) return null;

    const existing = await db.tasks.get(input.taskId);
    if (!existing) {
        // Create a placeholder task if it doesn't exist locally
        const now = new Date().toISOString();
        const placeholder: LocalTask = {
            taskId: input.taskId,
            taskType: TaskType.UNSPECIFIED,
            taskStatus: TaskStatus.ACTIVE,
            title: "",
            description: "",
            color: "",
            createdAt: { seconds: Math.floor(Date.now() / 1000).toString() },
            _localCreatedAt: now,
            _localUpdatedAt: now,
            _syncStatus: syncStatus,
        };
        await db.tasks.put(placeholder);
    }

    const updates: Partial<LocalTask> = {
        _localUpdatedAt: new Date().toISOString(),
        _syncStatus: syncStatus,
    };

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
    return { taskId: input.taskId };
}

/**
 * Delete a task locally (for offline use)
 */
async function deleteTaskLocally(taskId: string): Promise<boolean> {
    const db = getTaskDB();
    if (!db) return false;

    await db.tasks.delete(taskId);
    return true;
}

/**
 * Sync server tasks to local database
 */
async function syncTasksToLocal(tasks: SerializableTask[]): Promise<void> {
    const db = getTaskDB();
    if (!db) return;

    const now = new Date().toISOString();
    const localTasks: LocalTask[] = tasks.map((task) => ({
        ...task,
        _localCreatedAt: now,
        _localUpdatedAt: now,
        _syncStatus: "synced" as const,
    }));

    // Use bulkPut to update or insert all tasks
    await db.tasks.bulkPut(localTasks);
}

/**
 * Offline-aware server task service.
 * - Always maintains local copy of tasks
 * - When online: syncs with server and updates local
 * - When offline: stores locally and queues operation for later sync
 */
function createOfflineAwareServerTaskService(): TaskService {
    return {
        async create(input) {
            const isOnline = getNetworkStatus();

            // If offline, store locally and queue
            if (!isOnline) {
                const result = await storeTaskLocally(input, "pending");
                if (!result) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                    };
                }

                await queueCreateOperation(input);
                return {
                    data: { taskId: result.taskId },
                    isLocalOperation: true,
                };
            }

            // Try server first
            try {
                const result = await orpc.task.create(input);
                if (!result.error) {
                    // Also store locally as synced
                    await storeTaskLocally(input, "synced");
                }
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

                // Network error - store locally and queue
                if (isNetworkError(err)) {
                    const result = await storeTaskLocally(input, "pending");
                    if (!result) {
                        return {
                            data: { taskId: "" },
                            isLocalOperation: true,
                            error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                        };
                    }

                    await queueCreateOperation(input);
                    return {
                        data: { taskId: result.taskId },
                        isLocalOperation: true,
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
            const isOnline = getNetworkStatus();

            // If offline, try to get from local DB first
            if (!isOnline) {
                const db = getTaskDB();
                if (db) {
                    const task = await db.tasks.get(taskId);
                    if (task) {
                        return {
                            data: { task },
                            isLocalOperation: true,
                        };
                    }
                }
                return {
                    data: { task: undefined },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_NOT_FOUND,
                };
            }

            // Try server
            try {
                const result = await orpc.task.get({ taskId });
                // Update local cache if successful
                if (result.task) {
                    const db = getTaskDB();
                    if (db) {
                        const now = new Date().toISOString();
                        await db.tasks.put({
                            ...(result.task as SerializableTask),
                            _localCreatedAt: now,
                            _localUpdatedAt: now,
                            _syncStatus: "synced",
                        });
                    }
                }
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

                // Network error - try local
                if (isNetworkError(err)) {
                    const db = getTaskDB();
                    if (db) {
                        const task = await db.tasks.get(taskId);
                        if (task) {
                            return {
                                data: { task },
                                isLocalOperation: true,
                            };
                        }
                    }
                }

                return {
                    data: { task: undefined },
                    isLocalOperation: false,
                    error: ERROR_CODES.TASK_GET_FAILED,
                };
            }
        },

        async update(input) {
            const isOnline = getNetworkStatus();

            // If offline, update locally and queue
            if (!isOnline) {
                const result = await updateTaskLocally(input, "pending");
                if (!result) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: ERROR_CODES.TASK_NOT_FOUND,
                    };
                }

                await queueUpdateOperation(input);
                return {
                    data: { taskId: result.taskId },
                    isLocalOperation: true,
                };
            }

            // Try server first
            try {
                const result = await orpc.task.update(input);
                if (!result.error) {
                    // Also update locally as synced
                    await updateTaskLocally(input, "synced");
                }
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

                // Network error - update locally and queue
                if (isNetworkError(err)) {
                    const result = await updateTaskLocally(input, "pending");
                    if (!result) {
                        return {
                            data: { taskId: "" },
                            isLocalOperation: true,
                            error: ERROR_CODES.TASK_NOT_FOUND,
                        };
                    }

                    await queueUpdateOperation(input);
                    return {
                        data: { taskId: result.taskId },
                        isLocalOperation: true,
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
            const isOnline = getNetworkStatus();

            // If offline, delete locally and queue
            if (!isOnline) {
                await deleteTaskLocally(taskId);
                await clearOperationsForTask(taskId);
                await queueDeleteOperation(taskId);
                return {
                    data: { success: true },
                    isLocalOperation: true,
                };
            }

            // Try server first
            try {
                const result = await orpc.task.delete({ taskId });
                if (result.success) {
                    // Also delete locally
                    await deleteTaskLocally(taskId);
                }
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

                // Network error - delete locally and queue
                if (isNetworkError(err)) {
                    await deleteTaskLocally(taskId);
                    await clearOperationsForTask(taskId);
                    await queueDeleteOperation(taskId);
                    return {
                        data: { success: true },
                        isLocalOperation: true,
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
            const isOnline = getNetworkStatus();

            // If offline, get from local DB
            if (!isOnline) {
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
            }

            // Try server
            try {
                const result = await orpc.task.listActive();
                if (!result.error) {
                    // Sync to local
                    await syncTasksToLocal(result.tasks as SerializableTask[]);
                }
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

                // Network error - get from local
                if (isNetworkError(err)) {
                    const db = getTaskDB();
                    if (db) {
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
                    }
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
                const result = await storeTaskLocally(input);
                if (!result) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: ERROR_CODES.DEVICE_STORAGE_UNAVAILABLE,
                    };
                }

                return {
                    data: { taskId: result.taskId },
                    isLocalOperation: true,
                };
            } catch (err) {
                console.error("TaskLocalService.create failed:", err);
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
            } catch (err) {
                console.error("TaskLocalService.get failed:", err);
                return {
                    data: { task: undefined },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_GET_FAILED,
                };
            }
        },

        async update(input) {
            try {
                const result = await updateTaskLocally(input);
                if (!result) {
                    return {
                        data: { taskId: "" },
                        isLocalOperation: true,
                        error: ERROR_CODES.TASK_NOT_FOUND,
                    };
                }

                return {
                    data: { taskId: result.taskId },
                    isLocalOperation: true,
                };
            } catch (err) {
                console.error("TaskLocalService.update failed:", err);
                return {
                    data: { taskId: "" },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_UPDATE_FAILED,
                };
            }
        },

        async delete(taskId) {
            try {
                await deleteTaskLocally(taskId);
                return {
                    data: { success: true },
                    isLocalOperation: true,
                };
            } catch (err) {
                console.error("TaskLocalService.delete failed:", err);
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
            } catch (err) {
                console.error("TaskLocalService.listActive failed:", err);
                return {
                    data: { tasks: [] },
                    isLocalOperation: true,
                    error: ERROR_CODES.TASK_LIST_FAILED,
                };
            }
        },
    };
}
