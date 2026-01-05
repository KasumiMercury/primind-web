import { authLogger } from "../server/logger.server";

export interface JWTPayload {
    exp?: number;
    iss?: string;
    iat?: number;
    jti?: string;
    [key: string]: unknown;
}

export interface JWTValidationResult {
    isValid: boolean;
    payload?: JWTPayload;
    error?: string;
}

export function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }
        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8"),
        );
        return payload;
    } catch {
        return null;
    }
}

export function validateJWT(token: string): JWTValidationResult {
    const payload = decodeJWT(token);

    if (!payload) {
        authLogger.warn("Failed to decode JWT");
        return { isValid: false, error: "Invalid JWT format" };
    }

    if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            authLogger.warn("JWT expired");
            return { isValid: false, payload, error: "Token expired" };
        }
    }

    const expectedIssuer = process.env.JWT_ISSUER;
    if (expectedIssuer && payload.iss !== expectedIssuer) {
        authLogger.warn(
            { expected: expectedIssuer, actual: payload.iss },
            "JWT issuer mismatch",
        );
        return { isValid: false, payload, error: "Invalid issuer" };
    }

    return { isValid: true, payload };
}
