import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { TaskService } from "~/gen/task/v1/task_pb";
import { connectMockApi, logTransportMode } from "~/lib/mock-utils.server";
import { taskLogger } from "~/task/logger.server";
import { createTaskMockTransport } from "~/task/task-mock.server";

const useMock = connectMockApi();

const transport = useMock
    ? createTaskMockTransport()
    : createConnectTransport({
          baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
          httpVersion: "1.1",
      });

logTransportMode("TaskService", useMock, taskLogger);

export const taskClient = createClient(TaskService, transport);
