import { create } from "@bufbuild/protobuf";
import { redirect } from "react-router";
import { authClient } from "~/auth/auth-client.server";
import { stateCookie } from "~/auth/session.server";
import { OIDCParamsRequestSchema, OIDCProvider } from "~/gen/auth/v1/auth_pb";

function validateEnvironment() {
    const required = {
        VITE_OIDC_GOOGLE_CLIENT_ID: process.env.VITE_OIDC_GOOGLE_CLIENT_ID,
    };

    const missing = Object.entries(required)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}\n`,
        );
    }

    return required;
}

const env = validateEnvironment();

export async function googleLoginAction() {
    try {
        const clientId = env.VITE_OIDC_GOOGLE_CLIENT_ID;

        const paramsRequest = create(OIDCParamsRequestSchema, {
            provider: OIDCProvider.OIDC_PROVIDER_GOOGLE,
            clientId,
        });

        const params = await authClient.oIDCParams(paramsRequest);

        const setCookieHeaders = await stateCookie.serialize(params.state);

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
