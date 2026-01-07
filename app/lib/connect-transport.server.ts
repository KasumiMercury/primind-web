import type { Interceptor, Transport } from "@connectrpc/connect";

const isCloudflareBuild = import.meta.env.VITE_RUNTIME === "cloudflare";

interface RuntimeConnectTransportOptions {
    baseUrl: string;
    httpVersion: "1.1" | "2";
    interceptors?: Interceptor[];
}

export async function createRuntimeConnectTransport(
    options: RuntimeConnectTransportOptions,
): Promise<Transport> {
    if (isCloudflareBuild) {
        const { createConnectTransport } = await import(
            "@connectrpc/connect-web"
        );
        const { httpVersion: _httpVersion, ...webOptions } = options;
        return createConnectTransport(webOptions);
    }

    const { createConnectTransport } = await import("@connectrpc/connect-node");
    return createConnectTransport(options);
}
