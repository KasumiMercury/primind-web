import { v7 as uuidv7 } from "uuid";
import type { CreateTaskInput, UpdateTaskInput } from "~/orpc/schemas/task";
import { getTaskDB } from "./db.client";
import type { OperationType, QueuedOperation } from "./types";

const MAX_RETRY_COUNT = 5;

/**
 * Add a create operation to the queue
 */
export async function queueCreateOperation(
    input: CreateTaskInput,
): Promise<QueuedOperation | null> {
    return queueOperation("create", input.taskId, input);
}

/**
 * Add an update operation to the queue
 */
export async function queueUpdateOperation(
    input: UpdateTaskInput,
): Promise<QueuedOperation | null> {
    return queueOperation("update", input.taskId, input);
}

/**
 * Add a delete operation to the queue
 */
export async function queueDeleteOperation(
    taskId: string,
): Promise<QueuedOperation | null> {
    return queueOperation("delete", taskId, { taskId });
}

/**
 * Generic function to add an operation to the queue
 */
async function queueOperation(
    operationType: OperationType,
    taskId: string,
    payload: CreateTaskInput | UpdateTaskInput | { taskId: string },
): Promise<QueuedOperation | null> {
    const db = getTaskDB();
    if (!db) return null;

    const operation: QueuedOperation = {
        id: uuidv7(),
        operationType,
        taskId,
        payload,
        createdAt: new Date().toISOString(),
        retryCount: 0,
    };

    await db.operationQueue.add(operation);
    return operation;
}

/**
 * Get all pending operations in order (oldest first)
 */
export async function getPendingOperations(): Promise<QueuedOperation[]> {
    const db = getTaskDB();
    if (!db) return [];

    return db.operationQueue.orderBy("createdAt").toArray();
}

/**
 * Get pending operations count
 */
export async function getPendingOperationsCount(): Promise<number> {
    const db = getTaskDB();
    if (!db) return 0;

    return db.operationQueue.count();
}

/**
 * Remove an operation from the queue (after successful sync)
 */
export async function removeOperation(operationId: string): Promise<void> {
    const db = getTaskDB();
    if (!db) return;

    await db.operationQueue.delete(operationId);
}

/**
 * Update operation on failure (increment retry count, set error)
 */
export async function markOperationFailed(
    operationId: string,
    error: string,
): Promise<boolean> {
    const db = getTaskDB();
    if (!db) return false;

    const operation = await db.operationQueue.get(operationId);
    if (!operation) return false;

    const newRetryCount = operation.retryCount + 1;

    if (newRetryCount >= MAX_RETRY_COUNT) {
        // Remove operation after max retries
        await db.operationQueue.delete(operationId);
        return false;
    }

    await db.operationQueue.update(operationId, {
        retryCount: newRetryCount,
        lastError: error,
    });

    return true;
}

/**
 * Clear all operations for a specific task
 * Useful when a task is deleted locally while offline
 */
export async function clearOperationsForTask(taskId: string): Promise<void> {
    const db = getTaskDB();
    if (!db) return;

    await db.operationQueue.where("taskId").equals(taskId).delete();
}

/**
 * Clear all pending operations
 */
export async function clearAllOperations(): Promise<void> {
    const db = getTaskDB();
    if (!db) return;

    await db.operationQueue.clear();
}

/**
 * Check if there are any pending operations
 */
export async function hasPendingOperations(): Promise<boolean> {
    const count = await getPendingOperationsCount();
    return count > 0;
}
