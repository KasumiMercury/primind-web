import type { SerializableTask } from "../server/list-active-tasks.server";

export type SyncStatus = "pending" | "synced" | "conflict";

export interface LocalTask extends SerializableTask {
    _localCreatedAt: string;
    _localUpdatedAt: string;
    _syncStatus?: SyncStatus;
}
