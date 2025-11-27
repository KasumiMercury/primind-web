import { data } from "react-router";
import LoginPageContent from "~/auth/login-page-content";
import { initiateOIDCFlow } from "~/auth/oidc/flow.server";
import { googleProvider } from "~/auth/oidc/providers/google.server";
import type { Route } from "../auth/+types/login";

export function meta(_: Route.MetaArgs) {
    return [{ title: "Sign In" }, { name: "description", content: "Sign in" }];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const provider = formData.get("provider");

    try {
        if (provider === "google") {
            return await initiateOIDCFlow(googleProvider);
        }

        throw new Error("Invalid provider");
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
