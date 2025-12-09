import { createContextValues } from "@connectrpc/connect";
import { getUserSession } from "~/auth/session.server";
import { sessionTokenKey } from "~/interceptor/auth-interceptor";

export async function createAuthContext(request: Request) {
    const { sessionToken } = await getUserSession(request);
    const contextValues = createContextValues().set(
        sessionTokenKey,
        sessionToken,
    );
    return { contextValues, sessionToken };
}
