interface SessionData {
    codeVerifier: string;
    createdAt: number;
}

const sessionStore = new Map<string, SessionData>();

const SESSION_EXPIRATION_MS = 10 * 60 * 1000;

function cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, data] of sessionStore.entries()) {
        if (now - data.createdAt > SESSION_EXPIRATION_MS) {
            sessionStore.delete(sessionId);
        }
    }
}

export function saveCodeVerifier(
    sessionId: string,
    codeVerifier: string,
): void {
    cleanupExpiredSessions();

    sessionStore.set(sessionId, {
        codeVerifier,
        createdAt: Date.now(),
    });
}

export function getCodeVerifier(sessionId: string): string | undefined {
    const data = sessionStore.get(sessionId);

    if (!data) {
        return undefined;
    }

    if (Date.now() - data.createdAt > SESSION_EXPIRATION_MS) {
        sessionStore.delete(sessionId);
        return undefined;
    }

    return data.codeVerifier;
}

export function deleteCodeVerifier(sessionId: string): void {
    sessionStore.delete(sessionId);
}

export function getSessionStoreSize(): number {
    return sessionStore.size;
}
