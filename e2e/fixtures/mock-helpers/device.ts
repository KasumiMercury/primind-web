import { Code } from "@connectrpc/connect";
import type { RegisterDeviceResponse as GeneratedRegisterDeviceResponse } from "../../../app/gen/device/v1/device_pb";
import type { OmitProtoFields } from "./types";

export { Code };

export type RegisterDeviceResponse =
    OmitProtoFields<GeneratedRegisterDeviceResponse>;

type RegisterMockFn = (config: {
    service: string;
    method: string;
    response?: unknown;
    error?: { code: number; message: string };
    once?: boolean;
    ttlMs?: number;
}) => Promise<void>;

export interface DeviceMockHelpers {
    // Success responses
    mockRegisterDevice: (
        response: Partial<RegisterDeviceResponse>,
    ) => Promise<void>;

    // Error responses
    mockRegisterDeviceError: (code: Code, message: string) => Promise<void>;
}

export function createDeviceMockHelpers(
    register: RegisterMockFn,
): DeviceMockHelpers {
    return {
        // Success responses
        mockRegisterDevice: async (response) => {
            await register({
                service: "device",
                method: "registerDevice",
                response: {
                    deviceId: response.deviceId || `mock-device-${Date.now()}`,
                    isNew: response.isNew ?? true,
                },
            });
        },

        // Error responses
        mockRegisterDeviceError: async (code, message) => {
            await register({
                service: "device",
                method: "registerDevice",
                error: { code, message },
            });
        },
    };
}
