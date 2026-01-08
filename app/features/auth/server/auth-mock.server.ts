import { create } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import {
    AuthService,
    LogoutResponseSchema,
    OIDCLoginResponseSchema,
    OIDCParamsResponseSchema,
    ValidateSessionResponseSchema,
} from "~/gen/auth/v1/auth_pb";
import { base64UrlEncode } from "~/lib/base64.server";
import { withErrorInjection } from "~/lib/mock-error-injection.server";
import { withMockOverride } from "~/lib/mock-registry.server";
import { getEnv } from "~/lib/runtime-env.server";
import { authLogger } from "./logger.server";

const mockSessions = new Map<string, string>();

function createMockJWT(sessionId: string): string {
    const header = { alg: "none", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        jti: sessionId,
        iss: getEnv("JWT_ISSUER") || "mock-issuer",
        iat: now,
        exp: now + 24 * 60 * 60,
    };

    return `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
        JSON.stringify(payload),
    )}.mock-signature`;
}

export function createAuthMockTransport() {
    authLogger.info("Creating mock AuthService transport");

    return createRouterTransport(({ service }) => {
        service(AuthService, {
            oIDCParams: (req) =>
                withMockOverride("auth", "oIDCParams", () =>
                    withErrorInjection("auth", "oIDCParams", () => {
                        authLogger.warn(
                            { provider: req.provider },
                            "Mock: OIDCParams called - this should not happen with mock flow enabled",
                        );

                        const state = `mock-state-${Date.now()}`;
                        const mockAuthUrl = `http://localhost:5173/callback/${req.provider}?code=fallback-mock-code&state=${state}`;

                        return create(OIDCParamsResponseSchema, {
                            authorizationUrl: mockAuthUrl,
                            state: state,
                        });
                    }),
                ),

            oIDCLogin: (req) =>
                withMockOverride("auth", "oIDCLogin", () =>
                    withErrorInjection("auth", "oIDCLogin", () => {
                        authLogger.debug(
                            { provider: req.provider, state: req.state },
                            "Mock: OIDCLogin called",
                        );

                        const sessionId = `mock-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                        const userId = `mock-user-${Date.now()}`;
                        const sessionToken = createMockJWT(sessionId);

                        mockSessions.set(sessionToken, userId);

                        authLogger.info(
                            { sessionId, userId },
                            "Mock: Created JWT session",
                        );

                        return create(OIDCLoginResponseSchema, {
                            sessionToken: sessionToken,
                        });
                    }),
                ),

            logout: (req) =>
                withMockOverride("auth", "logout", () =>
                    withErrorInjection("auth", "logout", () => {
                        authLogger.debug(
                            { sessionToken: req.sessionToken },
                            "Mock: Logout called",
                        );

                        const existed = mockSessions.has(req.sessionToken);
                        mockSessions.delete(req.sessionToken);

                        authLogger.info(
                            { sessionToken: req.sessionToken, existed },
                            "Mock: Logout completed",
                        );

                        return create(LogoutResponseSchema, {
                            success: true,
                        });
                    }),
                ),

            validateSession: (req) =>
                withMockOverride("auth", "validateSession", () =>
                    withErrorInjection("auth", "validateSession", () => {
                        authLogger.debug(
                            { sessionToken: req.sessionToken },
                            "Mock: ValidateSession called",
                        );

                        const userId = mockSessions.get(req.sessionToken);

                        if (!userId) {
                            authLogger.warn(
                                { sessionToken: req.sessionToken },
                                "Mock: Invalid session token",
                            );
                            return create(ValidateSessionResponseSchema, {
                                userId: "",
                            });
                        }

                        authLogger.debug(
                            { sessionToken: req.sessionToken, userId },
                            "Mock: Valid session",
                        );

                        return create(ValidateSessionResponseSchema, {
                            userId: userId,
                        });
                    }),
                ),
        });
    });
}
