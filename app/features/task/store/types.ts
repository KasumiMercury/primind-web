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
}
