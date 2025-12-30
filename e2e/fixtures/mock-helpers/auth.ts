import { Code } from "@connectrpc/connect";
import type {
    LogoutResponse as GeneratedLogoutResponse,
    OIDCLoginResponse as GeneratedOIDCLoginResponse,
    OIDCParamsResponse as GeneratedOIDCParamsResponse,
    ValidateSessionResponse as GeneratedValidateSessionResponse,
} from "../../../app/gen/auth/v1/auth_pb";
import type { OmitProtoFields } from "./types";

export { Code };

export type OIDCParamsResponse = OmitProtoFields<GeneratedOIDCParamsResponse>;
export type OIDCLoginResponse = OmitProtoFields<GeneratedOIDCLoginResponse>;
export type LogoutResponse = OmitProtoFields<GeneratedLogoutResponse>;
export type ValidateSessionResponse =
    OmitProtoFields<GeneratedValidateSessionResponse>;

type RegisterMockFn = (config: {
    service: string;
    method: string;
    response?: unknown;
    error?: { code: number; message: string };
    once?: boolean;
    ttlMs?: number;
}) => Promise<void>;

export interface AuthMockHelpers {
    // Success responses
    mockOIDCParams: (response: Partial<OIDCParamsResponse>) => Promise<void>;
    mockOIDCLogin: (response: Partial<OIDCLoginResponse>) => Promise<void>;
    mockLogout: (response?: Partial<LogoutResponse>) => Promise<void>;
    mockValidateSession: (
        response: Partial<ValidateSessionResponse>,
    ) => Promise<void>;

    // Error responses
    mockOIDCParamsError: (code: Code, message: string) => Promise<void>;
    mockOIDCLoginError: (code: Code, message: string) => Promise<void>;
    mockLogoutError: (code: Code, message: string) => Promise<void>;
    mockValidateSessionError: (code: Code, message: string) => Promise<void>;
}

export function createAuthMockHelpers(
    register: RegisterMockFn,
): AuthMockHelpers {
    return {
        // Success responses
        mockOIDCParams: async (response) => {
            await register({
                service: "auth",
                method: "oIDCParams",
                response: {
                    authorizationUrl:
                        response.authorizationUrl ||
                        "http://localhost:5173/callback/google?code=mock-code",
                    state: response.state || `mock-state-${Date.now()}`,
                },
            });
        },

        mockOIDCLogin: async (response) => {
            await register({
                service: "auth",
                method: "oIDCLogin",
                response: {
                    sessionToken:
                        response.sessionToken || `mock-session-${Date.now()}`,
                },
            });
        },

        mockLogout: async (_response) => {
            await register({
                service: "auth",
                method: "logout",
                response: {
                    success: true,
                },
            });
        },

        mockValidateSession: async (response) => {
            await register({
                service: "auth",
                method: "validateSession",
                response: {
                    userId: response.userId || `mock-user-${Date.now()}`,
                },
            });
        },

        // Error responses
        mockOIDCParamsError: async (code, message) => {
            await register({
                service: "auth",
                method: "oIDCParams",
                error: { code, message },
            });
        },

        mockOIDCLoginError: async (code, message) => {
            await register({
                service: "auth",
                method: "oIDCLogin",
                error: { code, message },
            });
        },

        mockLogoutError: async (code, message) => {
            await register({
                service: "auth",
                method: "logout",
                error: { code, message },
            });
        },

        mockValidateSessionError: async (code, message) => {
            await register({
                service: "auth",
                method: "validateSession",
                error: { code, message },
            });
        },
    };
}
