import { Code } from "@connectrpc/connect";
import {
    TaskStatus,
    TaskType,
} from "../../../app/gen/task/v1/task_pb";
import type {
    CreateTaskResponse as GeneratedCreateTaskResponse,
    DeleteTaskResponse as GeneratedDeleteTaskResponse,
    GetTaskResponse as GeneratedGetTaskResponse,
    ListActiveTasksResponse as GeneratedListActiveTasksResponse,
    Task as GeneratedTask,
    UpdateTaskResponse as GeneratedUpdateTaskResponse,
} from "../../../app/gen/task/v1/task_pb";
import type { OmitProtoFields, TimestampJson } from "./types";

export { Code, TaskStatus, TaskType };

export type Task = OmitProtoFields<
    Omit<GeneratedTask, "scheduledAt" | "createdAt" | "targetAt">
> & {
    scheduledAt?: TimestampJson;
    createdAt?: TimestampJson;
    targetAt?: TimestampJson;
};

// Response型はTaskを参照するものを置き換え
export type CreateTaskResponse = OmitProtoFields<
    Omit<GeneratedCreateTaskResponse, "task">
> & { task?: Task };

export type GetTaskResponse = OmitProtoFields<
    Omit<GeneratedGetTaskResponse, "task">
> & { task?: Task };

export type ListActiveTasksResponse = OmitProtoFields<
    Omit<GeneratedListActiveTasksResponse, "tasks">
> & { tasks: Task[] };

export type UpdateTaskResponse = OmitProtoFields<
    Omit<GeneratedUpdateTaskResponse, "task">
> & { task?: Task };

export type DeleteTaskResponse = OmitProtoFields<GeneratedDeleteTaskResponse>;

type RegisterMockFn = (config: {
    service: string;
    method: string;
    response?: unknown;
    error?: { code: number; message: string };
    once?: boolean;
    ttlMs?: number;
}) => Promise<void>;

export interface TaskMockHelpers {
    // Success responses
    mockCreateTask: (response: Partial<CreateTaskResponse>) => Promise<void>;
    mockGetTask: (response: Partial<GetTaskResponse>) => Promise<void>;
    mockListActiveTasks: (tasks: Partial<Task>[]) => Promise<void>;
    mockUpdateTask: (response: Partial<UpdateTaskResponse>) => Promise<void>;
    mockDeleteTask: (response?: Partial<DeleteTaskResponse>) => Promise<void>;

    // Error responses
    mockCreateTaskError: (code: Code, message: string) => Promise<void>;
    mockGetTaskError: (code: Code, message: string) => Promise<void>;
    mockListActiveTasksError: (code: Code, message: string) => Promise<void>;
    mockUpdateTaskError: (code: Code, message: string) => Promise<void>;
    mockDeleteTaskError: (code: Code, message: string) => Promise<void>;
}

function createDefaultTask(partial: Partial<Task>): Task {
    return {
        taskId: partial.taskId || `test-task-${Date.now()}`,
        taskType: partial.taskType ?? TaskType.SHORT,
        taskStatus: partial.taskStatus ?? TaskStatus.ACTIVE,
        title: partial.title || "",
        description: partial.description || "",
        color: partial.color || "#808080",
        scheduledAt: partial.scheduledAt,
        createdAt: partial.createdAt || {
            seconds: String(Math.floor(Date.now() / 1000)),
            nanos: 0,
        },
        targetAt: partial.targetAt,
    };
}

export function createTaskMockHelpers(
    register: RegisterMockFn,
): TaskMockHelpers {
    return {
        // Success responses
        mockCreateTask: async (response) => {
            await register({
                service: "task",
                method: "createTask",
                response: {
                    task: response.task
                        ? createDefaultTask(response.task)
                        : undefined,
                },
            });
        },

        mockGetTask: async (response) => {
            await register({
                service: "task",
                method: "getTask",
                response: {
                    task: response.task
                        ? createDefaultTask(response.task)
                        : undefined,
                },
            });
        },

        mockListActiveTasks: async (tasks) => {
            await register({
                service: "task",
                method: "listActiveTasks",
                response: {
                    tasks: tasks.map(createDefaultTask),
                },
            });
        },

        mockUpdateTask: async (response) => {
            await register({
                service: "task",
                method: "updateTask",
                response: {
                    task: response.task
                        ? createDefaultTask(response.task)
                        : undefined,
                },
            });
        },

        mockDeleteTask: async (_response) => {
            await register({
                service: "task",
                method: "deleteTask",
                response: {},
            });
        },

        // Error responses
        mockCreateTaskError: async (code, message) => {
            await register({
                service: "task",
                method: "createTask",
                error: { code, message },
            });
        },

        mockGetTaskError: async (code, message) => {
            await register({
                service: "task",
                method: "getTask",
                error: { code, message },
            });
        },

        mockListActiveTasksError: async (code, message) => {
            await register({
                service: "task",
                method: "listActiveTasks",
                error: { code, message },
            });
        },

        mockUpdateTaskError: async (code, message) => {
            await register({
                service: "task",
                method: "updateTask",
                error: { code, message },
            });
        },

        mockDeleteTaskError: async (code, message) => {
            await register({
                service: "task",
                method: "deleteTask",
                error: { code, message },
            });
        },
    };
}
