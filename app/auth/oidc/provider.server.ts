import type { OIDCProvider } from "~/gen/auth/v1/auth_pb";

export interface ProviderConfig {
    provider: OIDCProvider;
    clientId: string;
}

export interface OIDCProviderDefinition {
    name: string;
    getConfig(): ProviderConfig;
}
