import { createCookieSessionStorage } from "react-router";
import { deviceLogger } from "./logger.server";

function getDeviceSecret(): string {
    const secret = process.env.COOKIE_SECRET;

    if (process.env.NODE_ENV === "production") {
        if (!secret || secret === "dev-secret-change-in-production") {
            deviceLogger.error(
                "COOKIE_SECRET must be configured with a strong secret in production",
            );
            throw new Error(
                "COOKIE_SECRET must be set to a strong secret in production.",
            );
        }
        if (secret.length < 32) {
            deviceLogger.error(
                "COOKIE_SECRET in production is shorter than 32 characters",
            );
            throw new Error(
                "COOKIE_SECRET must be at least 32 characters long",
            );
        }
    } else if (!secret) {
        deviceLogger.warn(
            "COOKIE_SECRET not set; using development fallback secret",
        );
    }

    deviceLogger.debug(
        {
            isProduction: process.env.NODE_ENV === "production",
            secretConfigured: Boolean(secret),
        },
        "Resolved device secret configuration",
    );

    return secret || "dev-secret-change-in-production";
}

interface DeviceSessionData {
    deviceId: string;
}

interface DeviceSessionFlashData {
    error: string;
}

export const deviceStorage = createCookieSessionStorage<
    DeviceSessionData,
    DeviceSessionFlashData
>({
    cookie: {
        name: "device",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        secrets: [getDeviceSecret()],
    },
});

export async function getDeviceSession(request: Request) {
    const session = await deviceStorage.getSession(
        request.headers.get("Cookie"),
    );
    deviceLogger.debug(
        { hasDeviceId: Boolean(session.get("deviceId")) },
        "Loaded device session",
    );
    return {
        deviceId: session.get("deviceId"),
        getSession: () => session,
    };
}
