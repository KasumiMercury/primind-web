const isCloudflareBuild = import.meta.env.VITE_RUNTIME === "cloudflare";
const runtimeEnvKey = "__PRIMIND_RUNTIME_ENV__";

export type RuntimeEnv = Record<string, string | undefined>;

export function setRuntimeEnv(env: RuntimeEnv): void {
    if (!isCloudflareBuild) {
        return;
    }
    (globalThis as Record<string, unknown>)[runtimeEnvKey] = env;
}

export function getRuntimeEnv(): RuntimeEnv {
    if (isCloudflareBuild) {
        const globalEnv = (globalThis as Record<string, unknown>)[
            runtimeEnvKey
        ];
        if (globalEnv && typeof globalEnv === "object") {
            return globalEnv as RuntimeEnv;
        }
        return {};
    }
    return process.env as RuntimeEnv;
}

export function getEnv(key: string): string | undefined {
    return getRuntimeEnv()[key];
}

export function requireEnv(key: string, message?: string): string {
    const value = getEnv(key);
    if (!value) {
        throw new Error(
            message ?? `Missing required environment variable: ${key}`,
        );
    }
    return value;
}

export function isProduction(): boolean {
    return (getEnv("NODE_ENV") ?? "production") === "production";
}
