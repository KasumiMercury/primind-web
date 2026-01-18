import Dexie, { type EntityTable } from "dexie";
import type { LocalTask, QueuedOperation } from "./types";

const DB_NAME = "primind-local";
const DB_VERSION = 2;

export class TaskDatabase extends Dexie {
    tasks!: EntityTable<LocalTask, "taskId">;
    operationQueue!: EntityTable<QueuedOperation, "id">;

    constructor() {
        super(DB_NAME);

        // Version 1: Initial schema with tasks
        this.version(1).stores({
            tasks: "taskId, taskStatus, taskType, targetAt.seconds",
        });

        // Version 2: Add operation queue for offline sync
        this.version(DB_VERSION).stores({
            tasks: "taskId, taskStatus, taskType, targetAt.seconds",
            operationQueue: "id, taskId, operationType, createdAt",
        });
    }
}

let dbInstance: TaskDatabase | null = null;

export function getTaskDB(): TaskDatabase | null {
    if (typeof window === "undefined") {
        return null;
    }
    if (!dbInstance) {
        dbInstance = new TaskDatabase();
    }
    return dbInstance;
}

export function isTaskDBAvailable(): boolean {
    return typeof window !== "undefined" && "indexedDB" in window;
}
