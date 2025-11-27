import { create } from "@bufbuild/protobuf";
import { redirect } from "react-router";
import { authClient } from "~/auth/auth-client.server";
import type { CallbackError } from "~/auth/oidc/callback-status";
import { sessionStorage, stateCookie } from "~/auth/session.server";
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
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
        return {
            success: false,
            error: {
                type: "missing_parameters",
                message:
                    "Required authentication parameters are missing. Please try logging in again.",
            },
        };
    }

    const storedState = await stateCookie.parse(request.headers.get("Cookie"));
    if (!storedState || storedState !== state) {
        const _clearStateCookie = await stateCookie.serialize("", {
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

        const response = await authClient.oIDCLogin(loginRequest);

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
            await stateCookie.serialize("", { maxAge: 0 }),
        );

        return redirect("/", { headers });
    } catch (err) {
        console.error(`OAuth callback error (${provider}):`, err);

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
