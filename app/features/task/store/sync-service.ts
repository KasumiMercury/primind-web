import type { CreateTaskInput, UpdateTaskInput } from "~/orpc/schemas/task";
import { orpc } from "~/orpc/client";
import {
    getPendingOperations,
    markOperationFailed,
    removeOperation,
} from "./operation-queue";
import type { QueuedOperation } from "./types";

export interface SyncResult {
    success: boolean;
    processedCount: number;
    failedCount: number;
    errors: Array<{ operationId: string; error: string }>;
}

/**
 * Process a single operation
 */
async function processOperation(operation: QueuedOperation): Promise<boolean> {
    try {
        switch (operation.operationType) {
            case "create": {
                const input = operation.payload as CreateTaskInput;
                const result = await orpc.task.create(input);
                return !result.error;
            }
            case "update": {
                const input = operation.payload as UpdateTaskInput;
                const result = await orpc.task.update(input);
                return !result.error;
            }
            case "delete": {
                const input = operation.payload as { taskId: string };
                const result = await orpc.task.delete(input);
                return result.success;
            }
            default:
                return false;
        }
    } catch (error) {
        console.error(
            `Failed to process operation ${operation.id}:`,
            error,
        );
        return false;
    }
}

/**
 * Sync all pending operations to the server
 * Operations are processed in order (oldest first)
 */
export async function syncPendingOperations(): Promise<SyncResult> {
    const result: SyncResult = {
        success: true,
        processedCount: 0,
        failedCount: 0,
        errors: [],
    };

    const operations = await getPendingOperations();

    if (operations.length === 0) {
        return result;
    }

    for (const operation of operations) {
        const success = await processOperation(operation);

        if (success) {
            await removeOperation(operation.id);
            result.processedCount++;
        } else {
            const errorMessage = `Failed to sync ${operation.operationType} operation for task ${operation.taskId}`;
            const canRetry = await markOperationFailed(
                operation.id,
                errorMessage,
            );

            if (!canRetry) {
                result.errors.push({
                    operationId: operation.id,
                    error: `Max retries exceeded: ${errorMessage}`,
                });
            }

            result.failedCount++;
            result.success = false;
        }
    }

    return result;
}

let syncInProgress = false;
let syncListeners: Array<(result: SyncResult) => void> = [];

/**
 * Add a listener for sync completion
 */
export function addSyncListener(
    listener: (result: SyncResult) => void,
): () => void {
    syncListeners.push(listener);
    return () => {
        syncListeners = syncListeners.filter((l) => l !== listener);
    };
}

/**
 * Trigger sync if not already in progress
 */
export async function triggerSync(): Promise<SyncResult | null> {
    if (syncInProgress) {
        return null;
    }

    syncInProgress = true;

    try {
        const result = await syncPendingOperations();

        for (const listener of syncListeners) {
            try {
                listener(result);
            } catch (e) {
                console.error("Sync listener error:", e);
            }
        }

        return result;
    } finally {
        syncInProgress = false;
    }
}

/**
 * Check if sync is currently in progress
 */
export function isSyncing(): boolean {
    return syncInProgress;
}

/**
 * Initialize auto-sync on online event
 * Call this once on app startup
 */
export function initializeAutoSync(): () => void {
    const handleOnline = () => {
        triggerSync();
    };

    if (typeof window !== "undefined") {
        window.addEventListener("online", handleOnline);

        // Also trigger sync on initial load if online and there are pending operations
        if (navigator.onLine) {
            triggerSync();
        }

        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }

    return () => {};
}
