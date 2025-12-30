import { mockApiEnabled } from "./mock-utils.server";

export async function withMockErrorContext<T>(
    request: Request,
    fn: () => T | Promise<T>,
): Promise<T> {
    if (mockApiEnabled) {
        const { withRequestErrorContext } = await import(
            "./mock-error-injection.server"
        );
        return withRequestErrorContext(request, fn);
    }
    return fn();
}
