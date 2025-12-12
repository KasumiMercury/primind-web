import { createCookieSessionStorage } from "react-router";
import { authLogger } from "./logger.server";

function getSessionSecret(): string {
    const secret = process.env.COOKIE_SECRET;

    if (process.env.NODE_ENV === "production") {
        if (!secret || secret === "dev-secret-change-in-production") {
            authLogger.error(
                "COOKIE_SECRET must be configured with a strong secret in production",
            );
            throw new Error(
                "COOKIE_SECRET must be set to a strong secret in production.",
            );
        }
        if (secret.length < 32) {
            authLogger.error(
                "COOKIE_SECRET in production is shorter than 32 characters",
            );
            throw new Error(
                "COOKIE_SECRET must be at least 32 characters long",
            );
        }
    } else if (!secret) {
        authLogger.warn(
            "COOKIE_SECRET not set; using development fallback secret",
        );
    }

    authLogger.debug(
        {
            isProduction: process.env.NODE_ENV === "production",
            secretConfigured: Boolean(secret),
        },
        "Resolved session secret configuration",
    );

    return secret || "dev-secret-change-in-production";
}

interface SessionData {
    sessionToken: string;
}

interface SessionFlashData {
    error: string;
}

export const sessionStorage = createCookieSessionStorage<
    SessionData,
    SessionFlashData
>({
    cookie: {
        name: "session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        secrets: [getSessionSecret()],
    },
});

export async function getUserSession(request: Request) {
    const session = await sessionStorage.getSession(
        request.headers.get("Cookie"),
    );
    authLogger.debug(
        { hasSessionToken: Boolean(session.get("sessionToken")) },
        "Loaded user session",
    );
    return {
        sessionToken: session.get("sessionToken"),
        getSession: () => session,
    };
}
