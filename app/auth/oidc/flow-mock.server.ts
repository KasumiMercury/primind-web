import { redirect } from "react-router";
import { authLogger } from "~/auth/logger.server";
import type { OIDCProviderDefinition } from "~/auth/oidc/provider.server";
import { oidcStateCookie } from "~/auth/oidc/state-cookie.server";

function generateMockState(): string {
    return `mock-state-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

function generateMockCode(): string {
    return `mock-code-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export async function initiateMockOIDCFlow(
    request: Request,
    providerDef: OIDCProviderDefinition,
): Promise<Response> {
    try {
        const config = providerDef.getConfig();
        authLogger.debug(
            { provider: config.provider, mode: "mock" },
            "Starting mock OIDC flow",
        );

        const state = generateMockState();
        const code = generateMockCode();

        authLogger.debug(
            {
                provider: config.provider,
                state: `${state.substring(0, 20)}...`,
                code: `${code.substring(0, 20)}...`,
            },
            "Generated mock OIDC parameters",
        );

        let origin: string;
        try {
            origin = new URL(request.url).origin;
        } catch (err) {
            authLogger.error(
                { err, url: request.url },
                "Failed to parse request URL in mock flow",
            );
            throw new Error("Invalid request URL");
        }

        const callbackPath = `/callback/${providerDef.name}`;
        const callbackUrl = new URL(callbackPath, origin);
        callbackUrl.searchParams.set("code", code);
        callbackUrl.searchParams.set("state", state);

        authLogger.debug(
            {
                provider: config.provider,
                callbackUrl: callbackUrl.toString(),
            },
            "Redirecting to local callback URL (mock mode)",
        );

        const setCookieHeaders = await oidcStateCookie.serialize(state);

        return redirect(callbackUrl.toString(), {
            headers: {
                "Set-Cookie": setCookieHeaders,
            },
        });
    } catch (err) {
        authLogger.error(
            { err, providerName: providerDef.name },
            "Failed to initiate mock OIDC flow",
        );
        throw new Error(
            err instanceof Error
                ? err.message
                : "Unable to start mock authentication flow",
        );
    }
}
