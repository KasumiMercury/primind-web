import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import { withRequestErrorContext } from "~/lib/mock-error-injection.server";
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

export async function handleRPCRequest(request: Request): Promise<Response> {
    // Wrap with error context for mock error injection in tests
    return withRequestErrorContext(request, async () => {
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
    });
}
