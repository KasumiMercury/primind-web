import type { Client, Transport } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import {
    AuthService,
    type AuthService as AuthServiceType,
} from "~/gen/auth/v1/auth_pb";
import { createRuntimeConnectTransport } from "~/lib/connect-transport.server";
import { logTransportMode, mockApiEnabled } from "~/lib/mock-utils.server";
import { authLogger } from "./logger.server";

const useMock = mockApiEnabled;

async function createTransport(): Promise<Transport> {
    if (useMock) {
        const { createAuthMockTransport } = await import("./auth-mock.server");
        return createAuthMockTransport();
    }
    return createRuntimeConnectTransport({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
        httpVersion: "1.1",
    });
}

let authClientInstance: Client<typeof AuthServiceType> | null = null;

export async function getAuthClient(): Promise<Client<typeof AuthServiceType>> {
    if (!authClientInstance) {
        const transport = await createTransport();
        logTransportMode("AuthService", useMock, authLogger);
        authClientInstance = createClient(AuthService, transport);
    }
    return authClientInstance;
}
