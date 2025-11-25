import { redirect } from "react-router";
import { generateAuthorizationUrl } from "~/lib/oidc/client";
import { OIDCProvider } from "~/lib/oidc/providers";

export async function action() {
    try {
        const { authUrl } = await generateAuthorizationUrl(OIDCProvider.Google);

        return redirect(authUrl.href);
    } catch (error) {
        console.error("Error initiating Google login:", error);

        throw new Response(
            error instanceof Error
                ? error.message
                : "Failed to initiate Google login",
            { status: 500 },
        );
    }
}
