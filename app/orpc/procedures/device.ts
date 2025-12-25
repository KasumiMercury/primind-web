import { create } from "@bufbuild/protobuf";
import { getDeviceClient } from "~/features/device/server/device-client.server";
import {
    deviceStorage,
    getDeviceSession,
} from "~/features/device/server/device-cookie.server";
import { deviceLogger } from "~/features/device/server/logger.server";
import {
    Platform,
    RegisterDeviceRequestSchema,
} from "~/gen/device/v1/device_pb";
import { createAuthContext } from "~/lib/request-context.server";
import { baseProcedure } from "../middleware/auth";
import {
    registerDeviceInputSchema,
    registerDeviceOutputSchema,
} from "../schemas/device";

const platformMap: Record<string, Platform> = {
    web: Platform.WEB,
    android: Platform.ANDROID,
    ios: Platform.IOS,
};

export const registerDeviceProcedure = baseProcedure
    .input(registerDeviceInputSchema)
    .output(registerDeviceOutputSchema)
    .handler(async ({ input, context }) => {
        try {
            const { contextValues } = await createAuthContext(context.request);
            const { deviceId: existingDeviceId, getSession } =
                await getDeviceSession(context.request);

            const userAgent =
                context.request.headers.get("User-Agent") || "unknown";
            const acceptLanguage =
                context.request.headers.get("Accept-Language") || "";

            const platform = platformMap[input.platform.toLowerCase()];

            deviceLogger.debug(
                {
                    hasExistingDeviceId: Boolean(existingDeviceId),
                    timezone: input.timezone,
                    locale: input.locale,
                    platform: input.platform,
                    hasFcmToken: Boolean(input.fcmToken),
                },
                "Registering device",
            );

            const registerRequest = create(RegisterDeviceRequestSchema, {
                deviceId: existingDeviceId || undefined,
                timezone: input.timezone,
                locale: input.locale,
                platform,
                fcmToken: input.fcmToken || undefined,
                userAgent,
                acceptLanguage,
            });

            const deviceClient = await getDeviceClient();
            const response = await deviceClient.registerDevice(
                registerRequest,
                {
                    contextValues,
                },
            );

            deviceLogger.info(
                {
                    deviceId: response.deviceId,
                    isNew: response.isNew,
                },
                "Device registered successfully",
            );

            const session = getSession();
            session.set("deviceId", response.deviceId);
            const setCookieValue = await deviceStorage.commitSession(session);

            // Use ResponseHeadersPlugin to set the Set-Cookie header
            context.resHeaders?.set("Set-Cookie", setCookieValue);

            return {
                success: true,
                deviceId: response.deviceId,
                isNew: response.isNew,
            };
        } catch (err) {
            deviceLogger.error({ err }, "RegisterDevice failed");
            return {
                success: false,
                error: "Failed to register device",
            };
        }
    });

export const deviceRouter = {
    register: registerDeviceProcedure,
};
