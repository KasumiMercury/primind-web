import type { Code } from "@connectrpc/connect";
import { mockApiEnabled } from "./mock-utils.server";

export type MockServiceType = "task" | "auth" | "device";

export interface MockConfig {
    testId: string;
    service: MockServiceType;
    method: string;
    response?: unknown;
    error?: {
        code: Code;
        message: string;
    };
    once?: boolean;
    createdAt: number;
    ttlMs: number;
}

interface MockRegistryInterface {
    register(config: Omit<MockConfig, "createdAt">): void;
    find(
        testId: string,
        service: MockServiceType,
        method: string,
    ): MockConfig | null;
    clear(testId: string): void;
    cleanup(): void;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

class MockRegistryImpl implements MockRegistryInterface {
    private mocks = new Map<string, MockConfig[]>();
    private cleanupInterval: ReturnType<typeof setInterval> | null = null;
    private destroyed = false;
    private boundDestroy: () => void;

    constructor() {
        this.boundDestroy = () => this.destroy();
        this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 1000);

        process.on("exit", this.boundDestroy);
        process.on("SIGINT", this.boundDestroy);
        process.on("SIGTERM", this.boundDestroy);

        if (process.env.NODE_ENV === "production") {
            console.warn(
                "[MockRegistry] WARNING: Mock API registry is active in production mode. " +
                    "This should only be used for testing purposes.",
            );
        }
    }

    register(config: Omit<MockConfig, "createdAt">): void {
        const fullConfig: MockConfig = {
            ...config,
            ttlMs: config.ttlMs || DEFAULT_TTL_MS,
            createdAt: Date.now(),
        };

        const existing = this.mocks.get(config.testId) || [];
        existing.push(fullConfig);
        this.mocks.set(config.testId, existing);
    }

    find(
        testId: string,
        service: MockServiceType,
        method: string,
    ): MockConfig | null {
        const configs = this.mocks.get(testId);
        if (!configs) return null;

        const now = Date.now();
        const index = configs.findIndex(
            (c) =>
                c.service === service &&
                c.method === method &&
                now - c.createdAt < c.ttlMs,
        );

        if (index === -1) return null;

        const config = configs[index];

        if (config.once) {
            configs.splice(index, 1);
            if (configs.length === 0) {
                this.mocks.delete(testId);
            }
        }

        return config;
    }

    clear(testId: string): void {
        this.mocks.delete(testId);
    }

    cleanup(): void {
        const now = Date.now();
        for (const [testId, configs] of this.mocks.entries()) {
            const validConfigs = configs.filter(
                (c) => now - c.createdAt < c.ttlMs,
            );
            if (validConfigs.length === 0) {
                this.mocks.delete(testId);
            } else if (validConfigs.length !== configs.length) {
                this.mocks.set(testId, validConfigs);
            }
        }
    }

    destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;

        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }

        process.off("exit", this.boundDestroy);
        process.off("SIGINT", this.boundDestroy);
        process.off("SIGTERM", this.boundDestroy);

        this.mocks.clear();
    }
}

export const mockRegistry: MockRegistryInterface | null = mockApiEnabled
    ? new MockRegistryImpl()
    : null;

let getCurrentTestIdFn: (() => string | null) | null = null;

async function getTestIdGetter(): Promise<() => string | null> {
    if (!getCurrentTestIdFn) {
        const { getCurrentTestId } = await import("./mock-context.server");
        getCurrentTestIdFn = getCurrentTestId;
    }
    return getCurrentTestIdFn;
}

export async function withMockOverride<T>(
    service: MockServiceType,
    method: string,
    handler: () => T | Promise<T>,
): Promise<T> {
    if (!mockApiEnabled || !mockRegistry) {
        return handler();
    }

    const getCurrentTestId = await getTestIdGetter();
    const testId = getCurrentTestId();

    if (!testId) {
        return handler();
    }

    const mockConfig = mockRegistry.find(testId, service, method);

    if (!mockConfig) {
        return handler();
    }

    if (mockConfig.error) {
        const { ConnectError } = await import("@connectrpc/connect");
        throw new ConnectError(mockConfig.error.message, mockConfig.error.code);
    }

    return mockConfig.response as T;
}
