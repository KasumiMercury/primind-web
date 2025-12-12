import { redirect } from "react-router";
import { getAuthClient } from "~/auth/auth-client.server";
import { authLogger } from "~/auth/logger.server";
import { getUserSession, sessionStorage } from "~/auth/session.server";
import type { Route } from "./+types/logout";

export async function loader() {
    throw new Response("Method Not Allowed", { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
    const { sessionToken, getSession } = await getUserSession(request);

    if (sessionToken) {
        try {
            const authClient = await getAuthClient();
            await authClient.logout({ sessionToken });
            authLogger.info("User logged out successfully");
        } catch (error) {
            authLogger.error({ error }, "Failed to call logout service");
        }
    }

    const session = getSession();

    return redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}
