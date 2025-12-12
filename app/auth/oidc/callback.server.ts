import { create } from "@bufbuild/protobuf";
import { redirect } from "react-router";
import { getAuthClient } from "~/auth/auth-client.server";
import { authLogger } from "~/auth/logger.server";
import type { CallbackError } from "~/auth/oidc/callback-status";
import { oidcStateCookie } from "~/auth/oidc/state-cookie.server";
import { sessionStorage } from "~/auth/session.server";
import {
    OIDCLoginRequestSchema,
    type OIDCProvider,
} from "~/gen/auth/v1/auth_pb";

interface OAuthCallbackParams {
    request: Request;
    provider: OIDCProvider;
}

export type OAuthCallbackResult =
    | { success: true }
    | { success: false; error: CallbackError };

export async function handleOAuthCallback({
    request,
    provider,
}: OAuthCallbackParams): Promise<Response | OAuthCallbackResult> {
    authLogger.debug({ provider }, "Processing OAuth callback");
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
        authLogger.warn(
            {
                provider,
                hasCode: Boolean(code),
                hasState: Boolean(state),
            },
            "OAuth callback missing required parameters",
        );
        return {
            success: false,
            error: {
                type: "missing_parameters",
                message:
                    "Required authentication parameters are missing. Please try logging in again.",
            },
        };
    }

    const storedState = await oidcStateCookie.parse(
        request.headers.get("Cookie"),
    );
    if (!storedState || storedState !== state) {
        authLogger.warn(
            { provider, storedStatePresent: Boolean(storedState) },
            "OAuth callback state mismatch",
        );
        const _clearStateCookie = await oidcStateCookie.serialize("", {
            maxAge: 0,
        });

        return {
            success: false,
            error: {
                type: "invalid_state",
                message:
                    "Security validation failed. This may be due to an expired or tampered request. Please try logging in again.",
            },
        };
    }

    try {
        const loginRequest = create(OIDCLoginRequestSchema, {
            provider,
            code,
            state,
        });

        authLogger.debug(
            { provider },
            "Exchanging authorization code for session token",
        );
        const authClient = await getAuthClient();
        const response = await authClient.oIDCLogin(loginRequest);
        authLogger.debug(
            { provider },
            "Auth service returned session token response",
        );

        const session = await sessionStorage.getSession(
            request.headers.get("Cookie"),
        );
        session.set("sessionToken", response.sessionToken);

        const headers = new Headers();
        headers.append(
            "Set-Cookie",
            await sessionStorage.commitSession(session),
        );
        headers.append(
            "Set-Cookie",
            await oidcStateCookie.serialize("", { maxAge: 0 }),
        );

        authLogger.debug({ provider }, "OAuth login succeeded");
        authLogger.debug({ provider }, "Redirecting after successful login");
        return redirect("/", { headers });
    } catch (err) {
        authLogger.error(
            { err, provider },
            "OAuth callback failed during authentication",
        );

        return {
            success: false,
            error: {
                type: "authentication_failed",
                message:
                    "Unable to complete authentication. Please check your connection and try again.",
            },
        };
    }
}
