import { data } from "react-router";
import { ERROR_CODES } from "~/lib/errors";
import { initiateOIDCFlow } from "../oidc/flow.server";
import type { OIDCProviderDefinition } from "../oidc/provider.server";
import { googleProvider } from "../oidc/providers/google.server";
import { authLogger } from "../server/logger.server";
import type { Route } from "./+types/login";
import { LoginPageContent } from "./login-page-content";

const providerRegistry: Record<string, OIDCProviderDefinition> = {
    google: googleProvider,
};

export function meta(_: Route.MetaArgs) {
    return [{ title: "Login" }, { name: "description", content: "Login" }];
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
                error: ERROR_CODES.AUTH_LOGIN_FAILED,
            },
            { status: 400 },
        );
    }
}

export default function Login() {
    return <LoginPageContent />;
}
