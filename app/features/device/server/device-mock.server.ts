import { create } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import { v7 as uuidv7 } from "uuid";
import {
    DeviceService,
    RegisterDeviceResponseSchema,
} from "~/gen/device/v1/device_pb";
import { withErrorInjection } from "~/lib/mock-error-injection.server";
import { deviceLogger } from "./logger.server";

interface MockDevice {
    deviceId: string;
    timezone: string;
    locale: string;
    platform: number;
    fcmToken?: string;
    userAgent: string;
    acceptLanguage: string;
    updatedAt: string;
}

const mockDevices = new Map<string, MockDevice>();

export function createDeviceMockTransport() {
    deviceLogger.info("Creating mock DeviceService transport");

    return createRouterTransport(({ service }) => {
        service(DeviceService, {
            registerDevice: (req) =>
                withErrorInjection("device", "registerDevice", () => {
                    deviceLogger.debug(
                        {
                            deviceId: req.deviceId,
                            platform: req.platform,
                            timezone: req.timezone,
                            locale: req.locale,
                        },
                        "Mock: RegisterDevice called",
                    );

                    const isNew =
                        !req.deviceId || !mockDevices.has(req.deviceId);
                    const deviceId = req.deviceId || uuidv7();

                    mockDevices.set(deviceId, {
                        deviceId,
                        timezone: req.timezone,
                        locale: req.locale,
                        platform: req.platform,
                        fcmToken: req.fcmToken,
                        userAgent: req.userAgent,
                        acceptLanguage: req.acceptLanguage,
                        updatedAt: new Date().toISOString(),
                    });

                    deviceLogger.info(
                        { deviceId, isNewDevice: isNew },
                        "Mock: Device registered",
                    );

                    return create(RegisterDeviceResponseSchema, {
                        deviceId,
                        isNew,
                    });
                }),
        });
    });
}
