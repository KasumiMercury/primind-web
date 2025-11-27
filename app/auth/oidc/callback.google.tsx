import { useLoaderData } from "react-router";
import { handleOAuthCallback } from "~/auth/oidc/callback.server";
import { CallbackStatus } from "~/auth/oidc/callback-status";
import { OIDCProvider } from "~/gen/auth/v1/auth_pb";
import type { Route } from "../../auth/oidc/+types/callback.google";

export async function loader({ request }: Route.LoaderArgs) {
    return handleOAuthCallback({
        request,
        provider: OIDCProvider.OIDC_PROVIDER_GOOGLE,
    });
}

export default function CallbackGoogle() {
    const result = useLoaderData<typeof loader>();

    if (!result.success) {
        return (
            <CallbackStatus
                provider="Google"
                state="error"
                error={result.error}
            />
        );
    }

    return <CallbackStatus provider="Google" state="loading" />;
}
