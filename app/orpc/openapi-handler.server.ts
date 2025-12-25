import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { ORPCContext } from "./context";
import { router } from "./router";

const openAPIHandler = new OpenAPIHandler(router, {
    plugins: [
        new ResponseHeadersPlugin(),
        new OpenAPIReferencePlugin({
            docsProvider: "scalar",
            schemaConverters: [new ZodToJsonSchemaConverter()],
            specGenerateOptions: {
                info: {
                    title: "Primind API",
                    version: "1.0.0",
                    description: "Task management API for Primind",
                },
                security: [{ bearerAuth: [] }],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            description: "Session token authentication",
                        },
                    },
                },
            },
        }),
    ],
});

export async function handleOpenAPIRequest(
    request: Request,
): Promise<Response> {
    const context: ORPCContext = {
        request,
    };

    const { matched, response } = await openAPIHandler.handle(request, {
        prefix: "/api",
        context,
    });

    if (matched && response) {
        return response;
    }

    return new Response("Not Found", { status: 404 });
}
