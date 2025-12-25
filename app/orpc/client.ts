import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "./router";

const link = new RPCLink({
    url: () => {
        if (typeof window === "undefined") {
            throw new Error(
                "oRPC client should only be used on the client side",
            );
        }
        return `${window.location.origin}/api/rpc`;
    },
});

export const orpc: RouterClient<AppRouter> = createORPCClient(link);
