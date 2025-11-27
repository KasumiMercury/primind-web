import { create } from "@bufbuild/protobuf";
import { redirect } from "react-router";
import { authClient } from "~/auth/auth-client.server";
import type { OIDCProviderDefinition } from "~/auth/oidc/provider.server";
import { oidcStateCookie } from "~/auth/oidc/state-cookie.server";
import { OIDCParamsRequestSchema } from "~/gen/auth/v1/auth_pb";

export async function initiateOIDCFlow(
    providerDef: OIDCProviderDefinition,
): Promise<Response> {
    try {
        const config = providerDef.getConfig();

        const paramsRequest = create(OIDCParamsRequestSchema, {
            provider: config.provider,
            clientId: config.clientId,
        });

        const params = await authClient.oIDCParams(paramsRequest);

        const setCookieHeaders = await oidcStateCookie.serialize(params.state);

        return redirect(params.authorizationUrl, {
            headers: {
                "Set-Cookie": setCookieHeaders,
            },
        });
    } catch (err) {
        throw new Error(
            err instanceof Error
                ? err.message
                : "Unable to connect to authentication service",
        );
    }
}
