import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { createAuthMockTransport } from "~/auth/auth-mock.server";
import { authLogger } from "~/auth/logger.server";
import { AuthService } from "~/gen/auth/v1/auth_pb";
import { connectMockApi, logTransportMode } from "~/lib/mock-utils.server";

const useMock = connectMockApi();

const transport = useMock
    ? createAuthMockTransport()
    : createConnectTransport({
          baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
          httpVersion: "1.1",
      });

logTransportMode("AuthService", useMock, authLogger);

export const authClient = createClient(AuthService, transport);
