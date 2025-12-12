import type { Client, Transport } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { authLogger } from "~/auth/logger.server";
import {
    AuthService,
    type AuthService as AuthServiceType,
} from "~/gen/auth/v1/auth_pb";
import { logTransportMode, mockApiEnabled } from "~/lib/mock-utils.server";

const useMock = mockApiEnabled;

async function createTransport(): Promise<Transport> {
    if (useMock) {
        const { createAuthMockTransport } = await import(
            "~/auth/auth-mock.server"
        );
        return createAuthMockTransport();
    }
    return createConnectTransport({
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
