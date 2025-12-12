import { AsyncLocalStorage } from "node:async_hooks";
import { Code, ConnectError } from "@connectrpc/connect";
import {
    ERROR_CONFIGS,
    type MockErrorConfig,
    type MockErrorMode,
} from "./mock-error-config";
import { mockApiEnabled } from "./mock-utils.server";

const useMock = mockApiEnabled;

interface ErrorContext {
    errorMode: MockErrorMode;
}

const errorContextStorage = new AsyncLocalStorage<ErrorContext>();

export function getCurrentErrorMode(): MockErrorMode {
    const context = errorContextStorage.getStore();
    if (context?.errorMode) {
        return context.errorMode;
    }

    const envMode = import.meta.env.VITE_MOCK_ERROR_MODE;
    if (envMode && envMode in ERROR_CONFIGS) {
        return envMode as MockErrorMode;
    }

    return "none";
}

export function parseErrorModeFromRequest(request: Request): MockErrorMode {
    const headerMode = request.headers.get("Mock-Error-Mode");
    if (headerMode && headerMode in ERROR_CONFIGS) {
        return headerMode as MockErrorMode;
    }

    const url = new URL(request.url);
    const queryMode = url.searchParams.get("_mockError");
    if (queryMode && queryMode in ERROR_CONFIGS) {
        return queryMode as MockErrorMode;
    }

    return "none";
}

export function runWithErrorContext<T>(
    errorMode: MockErrorMode,
    fn: () => T | Promise<T>,
): Promise<T> {
    return errorContextStorage.run({ errorMode }, () => Promise.resolve(fn()));
}

export function shouldInjectError(
    service: "task" | "auth",
    method: string,
): boolean {
    const errorMode = getCurrentErrorMode();
    const config = ERROR_CONFIGS[errorMode];
    if (!config) return false;

    if (config.service !== service) return false;
    if (config.method !== "*" && config.method !== method) return false;

    return true;
}

export function getErrorConfig(): MockErrorConfig | null {
    const errorMode = getCurrentErrorMode();
    return ERROR_CONFIGS[errorMode];
}

export async function injectError(): Promise<never> {
    const config = getErrorConfig();
    if (!config) {
        throw new ConnectError("Unknown error mode", Code.Internal);
    }

    if (config.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, config.delayMs));
    }

    throw new ConnectError(
        config.message || "Simulated error",
        config.code || Code.Internal,
    );
}

export async function withErrorInjection<T>(
    service: "task" | "auth",
    method: string,
    handler: () => T | Promise<T>,
): Promise<T> {
    if (shouldInjectError(service, method)) {
        await injectError();
    }
    return handler();
}

export async function withRequestErrorContext<T>(
    request: Request,
    fn: () => T | Promise<T>,
): Promise<T> {
    // Skip error context setup entirely when not in mock mode
    if (!useMock) {
        return Promise.resolve(fn());
    }
    const errorMode = parseErrorModeFromRequest(request);
    return runWithErrorContext(errorMode, fn);
}
