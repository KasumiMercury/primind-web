import type { UIProviderConfig } from "~/auth/oidc/providers";

export const mockProviders: UIProviderConfig[] = [
    {
        id: "google",
        displayName: "Google",
    },
    {
        id: "github",
        displayName: "GitHub",
    },
    {
        id: "microsoft",
        displayName: "Microsoft",
    },
];

export const singleProvider: UIProviderConfig[] = [
    {
        id: "google",
        displayName: "Google",
    },
];
