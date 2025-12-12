import { create } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import { authLogger } from "~/auth/logger.server";
import {
    AuthService,
    LogoutResponseSchema,
    OIDCLoginResponseSchema,
    OIDCParamsResponseSchema,
    ValidateSessionResponseSchema,
} from "~/gen/auth/v1/auth_pb";
import { withErrorInjection } from "~/lib/mock-error-injection.server";

const mockSessions = new Map<string, string>();

export function createAuthMockTransport() {
    authLogger.info("Creating mock AuthService transport");

    return createRouterTransport(({ service }) => {
        service(AuthService, {
            oIDCParams: (req) =>
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

            oIDCLogin: (req) =>
                withErrorInjection("auth", "oIDCLogin", () => {
                    authLogger.debug(
                        { provider: req.provider, state: req.state },
                        "Mock: OIDCLogin called",
                    );

                    const sessionToken = `mock-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                    const userId = `mock-user-${Date.now()}`;

                    mockSessions.set(sessionToken, userId);

                    authLogger.info(
                        { sessionToken, userId },
                        "Mock: Created session",
                    );

                    return create(OIDCLoginResponseSchema, {
                        sessionToken: sessionToken,
                    });
                }),

            logout: (req) =>
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

            validateSession: (req) =>
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
        });
    });
}
