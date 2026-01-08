import type { Client, Transport } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import {
    TaskService,
    type TaskService as TaskServiceType,
} from "~/gen/task/v1/task_pb";
import { authInterceptor } from "~/interceptor/auth-interceptor";
import { createRuntimeConnectTransport } from "~/lib/connect-transport.server";
import { logTransportMode, mockApiEnabled } from "~/lib/mock-utils.server";
import { taskLogger } from "./logger.server";

const useMock = mockApiEnabled;

async function createTransport(): Promise<Transport> {
    if (useMock) {
        const { createTaskMockTransport } = await import("./task-mock.server");
        return createTaskMockTransport();
    }
    return createRuntimeConnectTransport({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
        httpVersion: "1.1",
        interceptors: [authInterceptor],
    });
}

let taskClientInstance: Client<typeof TaskServiceType> | null = null;

export async function getTaskClient(): Promise<Client<typeof TaskServiceType>> {
    if (!taskClientInstance) {
        const transport = await createTransport();
        logTransportMode("TaskService", useMock, taskLogger);
        taskClientInstance = createClient(TaskService, transport);
    }
    return taskClientInstance;
}
