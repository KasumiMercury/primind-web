import { AsyncLocalStorage } from "node:async_hooks";

interface TestContext {
    testId: string;
}

const testContextStorage = new AsyncLocalStorage<TestContext>();

/**
 * Get the current test ID from AsyncLocalStorage context.
 * Returns undefined if not running in a test context.
 */
export function getCurrentTestId(): string | undefined {
    return testContextStorage.getStore()?.testId;
}

/**
 * Parse test ID from request headers.
 */
export function parseTestIdFromRequest(request: Request): string | undefined {
    return request.headers.get("X-Test-ID") ?? undefined;
}

/**
 * Run a function within a test context.
 * If testId is undefined, the function runs without test isolation.
 */
export async function withTestContext<T>(
    testId: string | undefined,
    fn: () => T | Promise<T>,
): Promise<T> {
    if (!testId) {
        return Promise.resolve(fn());
    }
    return testContextStorage.run({ testId }, () => Promise.resolve(fn()));
}
