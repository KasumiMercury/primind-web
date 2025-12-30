import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import { mockApiEnabled } from "~/lib/mock-utils.server";
import type { ORPCContext } from "./context";
import { router } from "./router";

const rpcHandler = new RPCHandler(router, {
    plugins: [new ResponseHeadersPlugin()],
    interceptors: [
        onError((error) => {
            console.error("[oRPC Error]", error);
        }),
    ],
});

async function handleRequest(request: Request): Promise<Response> {
    const context: ORPCContext = {
        request,
    };

    const { matched, response } = await rpcHandler.handle(request, {
        prefix: "/api/rpc",
        context,
    });

    if (matched && response) {
        return response;
    }

    return new Response("Not Found", { status: 404 });
}

export async function handleRPCRequest(request: Request): Promise<Response> {
    if (mockApiEnabled) {
        const { withRequestMockContext } = await import(
            "~/lib/mock-context.server"
        );
        const { withRequestErrorContext } = await import(
            "~/lib/mock-error-injection.server"
        );
        return withRequestMockContext(request, () =>
            withRequestErrorContext(request, () => handleRequest(request)),
        );
    }

    return handleRequest(request);
}
