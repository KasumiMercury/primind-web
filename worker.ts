import type { ServerBuild } from "react-router";
import { createRequestHandler } from "react-router";

type AssetBinding = { fetch: (request: Request) => Promise<Response> };

interface Env {
    ASSETS?: AssetBinding;
    [key: string]: string | AssetBinding | undefined;
}

const runtimeEnvKey = "__PRIMIND_RUNTIME_ENV__";

function setRuntimeEnvFromBindings(env: Env): void {
    const runtimeEnv: Record<string, string | undefined> = {};
    for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
            runtimeEnv[key] = value;
        }
    }
    runtimeEnv.NODE_ENV ||= "production";
    runtimeEnv.VITE_RUNTIME ||= "cloudflare";
    (globalThis as Record<string, unknown>)[runtimeEnvKey] = runtimeEnv;
}

let handlerPromise: Promise<ReturnType<typeof createRequestHandler>> | null =
    null;

async function getHandler(env: Env) {
    if (!handlerPromise) {
        setRuntimeEnvFromBindings(env);
        // @ts-expect-error Build output is generated at build time.
        const build = (await import("./build/server/index.js")) as ServerBuild;
        const mode =
            typeof env.NODE_ENV === "string" ? env.NODE_ENV : "production";
        handlerPromise = Promise.resolve(createRequestHandler(build, mode));
    }
    return handlerPromise;
}

export default {
    async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
        if (
            env.ASSETS &&
            (request.method === "GET" || request.method === "HEAD")
        ) {
            const assetResponse = await env.ASSETS.fetch(request);
            if (assetResponse.status !== 404) {
                return assetResponse;
            }
        }

        const handler = await getHandler(env);
        return handler(request, { env, ctx });
    },
};
