import { getAuthClient } from "~/features/auth/server/auth-client.server";
import { authLogger } from "~/features/auth/server/logger.server";
import {
    getUserSession,
    sessionStorage,
} from "~/features/auth/server/session.server";
import { baseProcedure } from "../middleware/auth";
import { logoutOutputSchema } from "../schemas/auth";

export const logoutProcedure = baseProcedure
    .output(logoutOutputSchema)
    .handler(async ({ context }) => {
        const { sessionToken, getSession } = await getUserSession(
            context.request,
        );

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
        const setCookieValue = await sessionStorage.destroySession(session);

        // Use ResponseHeadersPlugin to set the Set-Cookie header
        context.resHeaders?.set("Set-Cookie", setCookieValue);

        return {
            success: true,
        };
    });

export const authRouter = {
    logout: logoutProcedure,
};
