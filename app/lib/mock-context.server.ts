import { mockApiEnabled } from "./mock-utils.server";

interface MockContext {
    testId: string;
}

let mockContextStorage:
    | import("node:async_hooks").AsyncLocalStorage<MockContext>
    | null = null;

if (mockApiEnabled) {
    const { AsyncLocalStorage } = await import("node:async_hooks");
    mockContextStorage = new AsyncLocalStorage<MockContext>();
}

export function getCurrentTestId(): string | null {
    if (!mockApiEnabled || !mockContextStorage) return null;
    return mockContextStorage.getStore()?.testId ?? null;
}

function parseTestIdFromRequest(request: Request): string | null {
    return request.headers.get("X-Test-Id");
}

function runWithMockContext<T>(
    testId: string,
    fn: () => T | Promise<T>,
): Promise<T> {
    if (!mockContextStorage) {
        return Promise.resolve(fn());
    }
    return mockContextStorage.run({ testId }, () => Promise.resolve(fn()));
}

export async function withRequestMockContext<T>(
    request: Request,
    fn: () => T | Promise<T>,
): Promise<T> {
    if (!mockApiEnabled || !mockContextStorage) {
        return Promise.resolve(fn());
    }

    const testId = parseTestIdFromRequest(request);
    if (!testId) {
        return Promise.resolve(fn());
    }

    return runWithMockContext(testId, fn);
}
