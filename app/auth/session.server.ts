import { createCookieSessionStorage } from "react-router";

function getSessionSecret(): string {
    const secret = process.env.COOKIE_SECRET;

    if (process.env.NODE_ENV === "production") {
        if (!secret || secret === "dev-secret-change-in-production") {
            throw new Error(
                "COOKIE_SECRET must be set to a strong secret in production.\n" +
                    "Generate one with: openssl rand -base64 32",
            );
        }
        if (secret.length < 32) {
            throw new Error(
                "COOKIE_SECRET must be at least 32 characters long",
            );
        }
    }

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
    return {
        sessionToken: session.get("sessionToken"),
        getSession: () => session,
    };
}
