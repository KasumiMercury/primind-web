import type { CreateTaskInput, UpdateTaskInput } from "~/orpc/schemas/task";
import type { SerializableTask } from "../server/list-active-tasks.server";

export type SyncStatus = "pending" | "synced" | "conflict";

export interface LocalTask extends SerializableTask {
    _localCreatedAt: string;
    _localUpdatedAt: string;
    _syncStatus?: SyncStatus;
}

export interface TaskOperationResult<T> {
    data: T;
    isLocalOperation: boolean;
    error?: string;
    sessionInvalid?: boolean;
}

/**
 * Operation types for the offline queue
 */
export type OperationType = "create" | "update" | "delete";

/**
 * Represents a queued operation to be synced when online
 */
export interface QueuedOperation {
    id: string;
    operationType: OperationType;
    taskId: string;
    payload: CreateTaskInput | UpdateTaskInput | { taskId: string };
    createdAt: string;
    retryCount: number;
    lastError?: string;
}
