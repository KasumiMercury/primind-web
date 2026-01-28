import type { Client, Transport } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import {
    UserPeriodSettingsService,
    type UserPeriodSettingsService as UserPeriodSettingsServiceType,
} from "~/gen/task/v1/task_pb";
import { authInterceptor } from "~/interceptor/auth-interceptor";
import { createRuntimeConnectTransport } from "~/lib/connect-transport.server";
import { logTransportMode, mockApiEnabled } from "~/lib/mock-utils.server";
import { settingsLogger } from "./logger.server";

const useMock = mockApiEnabled;

async function createTransport(): Promise<Transport> {
    if (useMock) {
        const { createPeriodSettingMockTransport } = await import(
            "./period-setting-mock.server"
        );
        return createPeriodSettingMockTransport();
    }
    return createRuntimeConnectTransport({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
        httpVersion: "1.1",
        interceptors: [authInterceptor],
    });
}

let periodSettingClientInstance: Client<
    typeof UserPeriodSettingsServiceType
> | null = null;

export async function getPeriodSettingClient(): Promise<
    Client<typeof UserPeriodSettingsServiceType>
> {
    if (!periodSettingClientInstance) {
        const transport = await createTransport();
        logTransportMode("UserPeriodSettingsService", useMock, settingsLogger);
        periodSettingClientInstance = createClient(
            UserPeriodSettingsService,
            transport,
        );
    }
    return periodSettingClientInstance;
}
