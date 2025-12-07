import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { TaskService } from "~/gen/task/v1/task_pb";
import { taskLogger } from "~/task/logger.server";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

taskLogger.info({ baseUrl }, "Configuring task Connect client");

const transport = createConnectTransport({
    baseUrl,
    httpVersion: "1.1",
});

export const taskClient = createClient(TaskService, transport);
