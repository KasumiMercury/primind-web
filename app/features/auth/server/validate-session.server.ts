import { validateJWT } from "../lib/jwt.server";
import { authLogger } from "./logger.server";
import { getUserSession } from "./session.server";

export interface SessionValidationResult {
    isValid: boolean;
}

export async function validateSession(
    request: Request,
): Promise<SessionValidationResult> {
    const { sessionToken } = await getUserSession(request);

    if (!sessionToken) {
        return { isValid: false };
    }

    const result = validateJWT(sessionToken);

    if (!result.isValid) {
        authLogger.warn({ error: result.error }, "Session validation failed");
        return { isValid: false };
    }

    return { isValid: true };
}
