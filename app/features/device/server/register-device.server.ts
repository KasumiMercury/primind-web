import { create } from "@bufbuild/protobuf";
import { data } from "react-router";
import {
    Platform,
    RegisterDeviceRequestSchema,
} from "~/gen/device/v1/device_pb";
import { withRequestErrorContext } from "~/lib/mock-error-injection.server";
import { getDeviceClient } from "./device-client.server";
import { deviceStorage, getDeviceSession } from "./device-cookie.server";
import { deviceLogger } from "./logger.server";

const platformMap: Record<string, Platform> = {
    web: Platform.WEB,
    android: Platform.ANDROID,
    ios: Platform.IOS,
};

export async function registerDeviceAction(request: Request) {
    return withRequestErrorContext(request, async () => {
        const { deviceId: existingDeviceId, getSession } =
            await getDeviceSession(request);

        const userAgent = request.headers.get("User-Agent") || "unknown";
        const acceptLanguage = request.headers.get("Accept-Language") || "";

        let body: {
            timezone?: string;
            locale?: string;
            platform?: string;
            fcm_token?: string;
        };

        try {
            body = await request.json();
        } catch (err) {
            deviceLogger.warn({ err }, "Invalid JSON in request body");
            return data({ error: "Invalid JSON" }, { status: 400 });
        }

        if (!body.timezone || typeof body.timezone !== "string") {
            deviceLogger.warn(
                { timezone: body.timezone },
                "RegisterDevice action received invalid timezone",
            );
            return data({ error: "timezone is required" }, { status: 400 });
        }
        if (!body.locale || typeof body.locale !== "string") {
            deviceLogger.warn(
                { locale: body.locale },
                "RegisterDevice action received invalid locale",
            );
            return data({ error: "locale is required" }, { status: 400 });
        }
        if (!body.platform || typeof body.platform !== "string") {
            deviceLogger.warn(
                { platform: body.platform },
                "RegisterDevice action received invalid platform",
            );
            return data({ error: "platform is required" }, { status: 400 });
        }

        const platform = platformMap[body.platform.toLowerCase()];
        if (!platform) {
            deviceLogger.warn(
                { platform: body.platform },
                "RegisterDevice action received unknown platform",
            );
            return data(
                { error: "Invalid platform. Must be: web, android, or ios" },
                { status: 400 },
            );
        }

        try {
            const registerRequest = create(RegisterDeviceRequestSchema, {
                deviceId: existingDeviceId || undefined,
                timezone: body.timezone,
                locale: body.locale,
                platform,
                fcmToken: body.fcm_token || undefined,
                userAgent,
                acceptLanguage,
            });

            deviceLogger.debug(
                {
                    hasExistingDeviceId: Boolean(existingDeviceId),
                    timezone: body.timezone,
                    locale: body.locale,
                    platform: body.platform,
                    hasFcmToken: Boolean(body.fcm_token),
                },
                "Registering device",
            );

            const deviceClient = await getDeviceClient();
            const response = await deviceClient.registerDevice(registerRequest);

            deviceLogger.info(
                {
                    deviceId: response.deviceId,
                    isNew: response.isNew,
                },
                "Device registered successfully",
            );

            const session = getSession();
            session.set("deviceId", response.deviceId);

            return data(
                {
                    success: true,
                    device_id: response.deviceId,
                    is_new: response.isNew,
                },
                {
                    status: 200,
                    headers: {
                        "Set-Cookie":
                            await deviceStorage.commitSession(session),
                    },
                },
            );
        } catch (err) {
            deviceLogger.error({ err }, "RegisterDevice action failed");
            return data(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to register device",
                },
                { status: 500 },
            );
        }
    });
}
