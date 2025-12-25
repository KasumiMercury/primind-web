import { ORPCError, os } from "@orpc/server";
import { createAuthContext } from "~/lib/request-context.server";
import type { ORPCContext } from "../context";

export const baseProcedure = os.$context<ORPCContext>();

export const authedProcedure = baseProcedure.use(async ({ context, next }) => {
    const { contextValues, sessionToken } = await createAuthContext(
        context.request,
    );

    if (!sessionToken) {
        throw new ORPCError("UNAUTHORIZED", {
            message: "Authentication required",
        });
    }

    return next({
        context: {
            sessionToken,
            contextValues,
        },
    });
});
