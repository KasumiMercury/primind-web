import * as client from "openid-client";
import { getProviderConfig, type OIDCProvider } from "./providers";
import {
    deleteCodeVerifier,
    getCodeVerifier,
    saveCodeVerifier,
} from "./session.server";

const configCache = new Map<
    string,
    client.Configuration & { serverMetadata: () => client.ServerMetadata }
>();

async function discoverIssuer(
    issuerUrl: string,
    clientId: string,
    clientSecret: string,
): Promise<
    client.Configuration & { serverMetadata: () => client.ServerMetadata }
> {
    const cacheKey = `${issuerUrl}:${clientId}`;

    const cached = configCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const issuer = new URL(issuerUrl);
    const config = await client.discovery(issuer, clientId, clientSecret);

    configCache.set(cacheKey, config);

    return config;
}

export async function generateAuthorizationUrl(
    provider: OIDCProvider,
): Promise<{
    authUrl: URL;
    state: string;
}> {
    const providerConfig = getProviderConfig(provider);

    const config = await discoverIssuer(
        providerConfig.issuerUrl,
        providerConfig.clientId,
        providerConfig.clientSecret,
    );

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

    const state = client.randomState();

    saveCodeVerifier(state, codeVerifier);

    const parameters: Record<string, string> = {
        redirect_uri: providerConfig.redirectUri,
        scope: providerConfig.scopes,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
    };

    const authUrl = client.buildAuthorizationUrl(config, parameters);

    return {
        authUrl,
        state,
    };
}

export async function validateCallback(
    _provider: OIDCProvider,
    currentUrl: URL,
    state: string,
): Promise<string> {
    const codeVerifier = getCodeVerifier(state);
    if (!codeVerifier) {
        throw new Error(
            "Invalid or expired session. Code verifier not found for state parameter.",
        );
    }

    const code = currentUrl.searchParams.get("code");
    if (!code) {
        const error = currentUrl.searchParams.get("error");
        const errorDescription =
            currentUrl.searchParams.get("error_description");

        if (error) {
            throw new Error(
                `OIDC authorization error: ${error}${errorDescription ? ` - ${errorDescription}` : ""}`,
            );
        }

        throw new Error("Missing authorization code in callback URL");
    }

    const callbackState = currentUrl.searchParams.get("state");
    if (callbackState !== state) {
        throw new Error("State parameter mismatch. Possible CSRF attack.");
    }

    deleteCodeVerifier(state);

    return code;
}
