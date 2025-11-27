import { create } from "@bufbuild/protobuf";
import { redirect } from "react-router";
import { authClient } from "~/auth/auth-client.server";
import { authLogger } from "~/auth/logger.server";
import type { OIDCProviderDefinition } from "~/auth/oidc/provider.server";
import { oidcStateCookie } from "~/auth/oidc/state-cookie.server";
import { OIDCParamsRequestSchema } from "~/gen/auth/v1/auth_pb";

export async function initiateOIDCFlow(
    providerDef: OIDCProviderDefinition,
): Promise<Response> {
    try {
        const config = providerDef.getConfig();
        authLogger.debug({ provider: config.provider }, "Starting OIDC flow");

        const paramsRequest = create(OIDCParamsRequestSchema, {
            provider: config.provider,
            clientId: config.clientId,
        });
        authLogger.debug(
            { providerName: providerDef.name },
            "Requesting OIDC authorization parameters",
        );

        const params = await authClient.oIDCParams(paramsRequest);
        authLogger.debug(
            {
                provider: config.provider,
            },
            "Received OIDC authorization parameters",
        );

        const setCookieHeaders = await oidcStateCookie.serialize(params.state);
        authLogger.debug(
            {
                redirectUrl: params.authorizationUrl,
            },
            "Redirecting to OIDC authorization endpoint",
        );

        return redirect(params.authorizationUrl, {
            headers: {
                "Set-Cookie": setCookieHeaders,
            },
        });
    } catch (err) {
        authLogger.error(
            { err, providerName: providerDef.name },
            "Failed to initiate OIDC flow",
        );
        throw new Error(
            err instanceof Error
                ? err.message
                : "Unable to connect to authentication service",
        );
    }
}
