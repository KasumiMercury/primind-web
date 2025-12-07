import { data } from "react-router";
import { authLogger } from "~/auth/logger.server";
import { LoginPageContent } from "~/auth/login-page-content";
import { initiateOIDCFlow } from "~/auth/oidc/flow.server";
import type { OIDCProviderDefinition } from "~/auth/oidc/provider.server";
import { googleProvider } from "~/auth/oidc/providers/google.server";
import type { Route } from "../auth/+types/login";

const providerRegistry: Record<string, OIDCProviderDefinition> = {
    google: googleProvider,
};

export function meta(_: Route.MetaArgs) {
    return [{ title: "Sign In" }, { name: "description", content: "Sign in" }];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const providerName = formData.get("provider");

    try {
        authLogger.debug(
            { providerRaw: providerName },
            "Login action received provider selection",
        );

        if (typeof providerName !== "string") {
            authLogger.warn(
                { provider: providerName },
                "Login action received invalid provider",
            );
            throw new Error("Invalid provider");
        }

        const provider = providerRegistry[providerName];
        if (!provider) {
            authLogger.warn(
                { provider: providerName },
                "Login action received unknown provider",
            );
            throw new Error(`Unknown provider: ${providerName}`);
        }

        authLogger.debug({ provider: providerName }, "Initiating login flow");
        return await initiateOIDCFlow(request, provider);
    } catch (err) {
        authLogger.error(
            { err, provider: providerName },
            "Login action failed to initiate OIDC flow",
        );
        return data(
            {
                error:
                    err instanceof Error
                        ? err.message
                        : "Failed to initiate login",
            },
            { status: 400 },
        );
    }
}

export default function Login() {
    return <LoginPageContent />;
}
