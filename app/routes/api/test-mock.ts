import {
    type ActionFunctionArgs,
    data,
    type LoaderFunctionArgs,
} from "react-router";
import { type MockServiceType, mockRegistry } from "~/lib/mock-registry.server";
import { mockApiEnabled } from "~/lib/mock-utils.server";

interface MockRegistrationRequest {
    service: MockServiceType;
    method: string;
    response?: unknown;
    error?: {
        code: number;
        message: string;
    };
    once?: boolean;
    ttlMs?: number;
}

export async function action({ request }: ActionFunctionArgs) {
    if (!mockApiEnabled || !mockRegistry) {
        return new Response("Not Found", { status: 404 });
    }

    const testId = request.headers.get("X-Test-Id");
    if (!testId) {
        return data({ error: "X-Test-Id header is required" }, { status: 400 });
    }

    if (request.method === "DELETE") {
        mockRegistry.clear(testId);
        return data({ success: true });
    }

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = (await request.json()) as MockRegistrationRequest;

        if (!body.service || !body.method) {
            return data(
                { error: "service and method are required" },
                { status: 400 },
            );
        }

        mockRegistry.register({
            testId,
            service: body.service,
            method: body.method,
            response: body.response,
            error: body.error,
            once: body.once ?? false,
            ttlMs: body.ttlMs ?? 5 * 60 * 1000,
        });

        return data({ success: true });
    } catch (_error) {
        return data({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function loader({ request }: LoaderFunctionArgs) {
    if (!mockApiEnabled || !mockRegistry) {
        return new Response("Not Found", { status: 404 });
    }

    const testId = request.headers.get("X-Test-Id");
    if (!testId) {
        return data({ error: "X-Test-Id header is required" }, { status: 400 });
    }

    return data({ available: true, testId });
}
