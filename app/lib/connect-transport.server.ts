import type { Interceptor, Transport } from "@connectrpc/connect";

const isCloudflareBuild = import.meta.env.VITE_RUNTIME === "cloudflare";

interface RuntimeConnectTransportOptions {
    baseUrl: string;
    httpVersion: "1.1" | "2";
    interceptors?: Interceptor[];
}

/**
 * Custom fetch for Cloudflare Workers.
 * connect-web hardcodes `redirect: "error"` which Cloudflare Workers doesn't support.
 * Workers only support "follow" and "manual" for the redirect option.
 * @see https://github.com/connectrpc/connect-es/blob/main/packages/connect-web/src/connect-transport.ts
 * @see https://developers.cloudflare.com/workers/runtime-apis/request/
 */
const cloudflareFetch: typeof fetch = (input, init) => {
    const {
        redirect: _redirect,
        mode: _mode,
        credentials: _credentials,
        ...rest
    } = init || {};
    return fetch(input, {
        ...rest,
        redirect: "manual",
    });
};

export async function createRuntimeConnectTransport(
    options: RuntimeConnectTransportOptions,
): Promise<Transport> {
    if (isCloudflareBuild) {
        const { createConnectTransport } = await import(
            "@connectrpc/connect-web"
        );
        const { httpVersion: _httpVersion, ...webOptions } = options;
        return createConnectTransport({
            ...webOptions,
            fetch: cloudflareFetch,
        });
    }

    const { createConnectTransport } = await import("@connectrpc/connect-node");
    return createConnectTransport(options);
}
