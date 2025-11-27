import { data } from "react-router";
import LoginSelector from "~/auth/login-selector";
import { googleLoginAction } from "~/auth/oidc/google_flow.server";
import type { Route } from "../auth/+types/login";

export function meta(_: Route.MetaArgs) {
    return [{ title: "Sign In" }, { name: "description", content: "Sign in" }];
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const provider = formData.get("provider");

    try {
        if (provider === "google") {
            return await googleLoginAction();
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
    return <LoginSelector />;
}
