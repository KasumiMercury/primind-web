import { Code } from "@connectrpc/connect";

export interface MockErrorConfig {
    service: "task" | "auth";
    method: string;
    errorType: "connect" | "network" | "timeout";
    code?: Code;
    message?: string;
    delayMs?: number;
}

export type MockErrorMode =
    | "none"
    | "task.create.fail"
    | "task.update.fail"
    | "task.delete.fail"
    | "task.list.fail"
    | "auth.login.fail"
    | "auth.session.expired"
    | "network.timeout"
    | "server.unavailable";

export const ERROR_CONFIGS: Record<MockErrorMode, MockErrorConfig | null> = {
    none: null,
    "task.create.fail": {
        service: "task",
        method: "createTask",
        errorType: "connect",
        code: Code.Internal,
        message: "Failed to create task: internal server error",
    },
    "task.update.fail": {
        service: "task",
        method: "updateTask",
        errorType: "connect",
        code: Code.Internal,
        message: "Failed to save changes",
    },
    "task.delete.fail": {
        service: "task",
        method: "deleteTask",
        errorType: "connect",
        code: Code.Internal,
        message: "Failed to delete task",
    },
    "task.list.fail": {
        service: "task",
        method: "listActiveTasks",
        errorType: "connect",
        code: Code.Internal,
        message: "Failed to load tasks",
    },
    "auth.login.fail": {
        service: "auth",
        method: "oIDCLogin",
        errorType: "connect",
        code: Code.Unauthenticated,
        message: "Authentication failed",
    },
    "auth.session.expired": {
        service: "auth",
        method: "validateSession",
        errorType: "connect",
        code: Code.Unauthenticated,
        message: "Session expired",
    },
    "network.timeout": {
        service: "task",
        method: "*",
        errorType: "timeout",
        delayMs: 30000,
        message: "Request timed out",
    },
    "server.unavailable": {
        service: "task",
        method: "*",
        errorType: "connect",
        code: Code.Unavailable,
        message: "Service temporarily unavailable",
    },
};
