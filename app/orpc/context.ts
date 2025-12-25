import type { ContextValues } from "@connectrpc/connect";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";

export interface ORPCContext extends ResponseHeadersPluginContext {
    request: Request;
}

export interface AuthenticatedContext extends ORPCContext {
    sessionToken: string;
    contextValues: ContextValues;
}
