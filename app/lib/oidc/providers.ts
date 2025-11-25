import { getOIDCProviderEnv } from "~/config/env.server";

export interface ProviderConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string;
    issuerUrl: string;
}

export enum OIDCProvider {
    Google = "google",
}

const supportedProviders: readonly OIDCProvider[] = [OIDCProvider.Google];

export function getProviderConfig(provider: OIDCProvider): ProviderConfig {
    if (!supportedProviders.includes(provider)) {
        throw new Error(
            `Unsupported OIDC provider: ${provider}. Supported providers: ${supportedProviders.join(", ")}`,
        );
    }

    const env = getOIDCProviderEnv(provider);

    return {
        clientId: env.clientId,
        clientSecret: env.clientSecret,
        redirectUri: env.redirectUri,
        scopes: env.scopes,
        issuerUrl: env.issuerUrl,
    };
}

export function getSupportedProviders(): readonly OIDCProvider[] {
    return supportedProviders;
}
