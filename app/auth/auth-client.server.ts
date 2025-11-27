import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { AuthService } from "~/gen/auth/v1/auth_pb";

const transport = createConnectTransport({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    httpVersion: "1.1",
});

export const authClient = createClient(AuthService, transport);
