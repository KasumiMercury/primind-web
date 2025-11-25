import { redirect } from "react-router";
import { validateCallback } from "~/lib/oidc/client";
import { OIDCProvider } from "~/lib/oidc/providers";
import type { Route } from "./+types/callback.google";

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");

    if (!state) {
        console.error("Missing state parameter in callback");
        throw new Response("Missing state parameter", { status: 400 });
    }

    try {
        const authorizationCode = await validateCallback(
            OIDCProvider.Google,
            url,
            state,
        );

        console.log("OIDC Authorization Code Retrieved:");
        console.log("Provider:", OIDCProvider.Google);
        console.log("Authorization Code:", authorizationCode);

        // TODO: POST authorization code to central backend

        return redirect("/");
    } catch (error) {
        console.error("Error processing Google callback:", error);

        throw new Response(
            error instanceof Error
                ? error.message
                : "Failed to process Google callback",
            { status: 400 },
        );
    }
}
