import type { Client, Transport } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import {
    DeviceService,
    type DeviceService as DeviceServiceType,
} from "~/gen/device/v1/device_pb";
import { authInterceptor } from "~/interceptor/auth-interceptor";
import { createRuntimeConnectTransport } from "~/lib/connect-transport.server";
import { logTransportMode, mockApiEnabled } from "~/lib/mock-utils.server";
import { deviceLogger } from "./logger.server";

const useMock = mockApiEnabled;

async function createTransport(): Promise<Transport> {
    if (useMock) {
        const { createDeviceMockTransport } = await import(
            "./device-mock.server"
        );
        return createDeviceMockTransport();
    }
    return createRuntimeConnectTransport({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
        httpVersion: "1.1",
        interceptors: [authInterceptor],
    });
}

let deviceClientInstance: Client<typeof DeviceServiceType> | null = null;

export async function getDeviceClient(): Promise<
    Client<typeof DeviceServiceType>
> {
    if (!deviceClientInstance) {
        const transport = await createTransport();
        logTransportMode("DeviceService", useMock, deviceLogger);
        deviceClientInstance = createClient(DeviceService, transport);
    }
    return deviceClientInstance;
}
