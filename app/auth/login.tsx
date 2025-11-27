import { data } from "react-router";
import LoginPageContent from "~/auth/login-page-content";
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
        if (typeof providerName !== "string") {
            throw new Error("Invalid provider");
        }

        const provider = providerRegistry[providerName];
        if (!provider) {
            throw new Error(`Unknown provider: ${providerName}`);
        }

        return await initiateOIDCFlow(provider);
    } catch (err) {
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
