import { OIDCProvider } from "~/gen/auth/v1/auth_pb";
import { getEnv } from "~/lib/runtime-env.server";
import { authLogger } from "../../server/logger.server";
import type {
    OIDCProviderDefinition,
    ProviderConfig,
} from "../provider.server";

function validateGoogleEnvironment() {
    const clientId = getEnv("VITE_OIDC_GOOGLE_CLIENT_ID");

    if (!clientId) {
        authLogger.error(
            "Missing required environment variable: VITE_OIDC_GOOGLE_CLIENT_ID",
        );
        throw new Error(
            "Missing required environment variable: VITE_OIDC_GOOGLE_CLIENT_ID",
        );
    }

    return { clientId };
}

class GoogleProvider implements OIDCProviderDefinition {
    name = "google";

    getConfig(): ProviderConfig {
        const env = validateGoogleEnvironment();

        return {
            provider: OIDCProvider.OIDC_PROVIDER_GOOGLE,
            clientId: env.clientId,
        };
    }
}

export const googleProvider = new GoogleProvider();
