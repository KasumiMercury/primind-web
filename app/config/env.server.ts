export interface OIDCProviderEnv {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string;
    issuerUrl: string;
}

function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(
            `Missing required environment variable: ${key}\nPlease check your .env file and ensure all required variables are set.`,
        );
    }
    return value;
}

export function getOIDCProviderEnv(provider: string): OIDCProviderEnv {
    const upperProvider = provider.toUpperCase();

    return {
        clientId: getEnvVar(`OIDC_${upperProvider}_CLIENT_ID`),
        clientSecret: getEnvVar(`OIDC_${upperProvider}_CLIENT_SECRET`),
        redirectUri: getEnvVar(`OIDC_${upperProvider}_REDIRECT_URI`),
        scopes: getEnvVar(`OIDC_${upperProvider}_SCOPES`),
        issuerUrl: getEnvVar(`OIDC_${upperProvider}_ISSUER_URL`),
    };
}
