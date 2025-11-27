import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { authLogger } from "~/auth/logger.server";
import { AuthService } from "~/gen/auth/v1/auth_pb";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

authLogger.info({ baseUrl }, "Configuring auth Connect client");

const transport = createConnectTransport({
    baseUrl,
    httpVersion: "1.1",
});

export const authClient = createClient(AuthService, transport);
