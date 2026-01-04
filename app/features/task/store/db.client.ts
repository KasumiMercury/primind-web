import Dexie, { type EntityTable } from "dexie";
import type { LocalTask } from "./types";

const DB_NAME = "primind-local";
const DB_VERSION = 1;

export class TaskDatabase extends Dexie {
    tasks!: EntityTable<LocalTask, "taskId">;

    constructor() {
        super(DB_NAME);
        this.version(DB_VERSION).stores({
            tasks: "taskId, taskStatus, taskType, targetAt.seconds",
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
