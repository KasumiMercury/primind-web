import { test as base } from "@playwright/test";
import { v7 as uuidv7 } from "uuid";
import {
    type AuthMockHelpers,
    createAuthMockHelpers,
} from "./mock-helpers/auth";
import {
    createDeviceMockHelpers,
    type DeviceMockHelpers,
} from "./mock-helpers/device";
import {
    createTaskMockHelpers,
    type TaskMockHelpers,
} from "./mock-helpers/task";

export interface MockApiFixture {
    testId: string;
    task: TaskMockHelpers;
    auth: AuthMockHelpers;
    device: DeviceMockHelpers;
    clearMocks: () => Promise<void>;
}

type RegisterMockFn = (config: {
    service: string;
    method: string;
    response?: unknown;
    error?: { code: number; message: string };
    once?: boolean;
    ttlMs?: number;
}) => Promise<void>;

export const test = base.extend<{
    mockApi: MockApiFixture;
}>({
    mockApi: async ({ context, request }, use) => {
        const testId = uuidv7();

        // Set test ID header for all requests from the browser context
        await context.setExtraHTTPHeaders({
            "X-Test-Id": testId,
        });

        const registerMock: RegisterMockFn = async (config) => {
            const response = await request.post(
                "http://localhost:5173/api/test-mock",
                {
                    headers: { "X-Test-Id": testId },
                    data: config,
                },
            );
            if (!response.ok()) {
                throw new Error(
                    `Failed to register mock: ${await response.text()}`,
                );
            }
        };

        const clearMocks = async () => {
            // Use DELETE via action
            await request.fetch("http://localhost:5173/api/test-mock", {
                method: "DELETE",
                headers: { "X-Test-Id": testId },
            });
        };

        const mockApi: MockApiFixture = {
            testId,
            task: createTaskMockHelpers(registerMock),
            auth: createAuthMockHelpers(registerMock),
            device: createDeviceMockHelpers(registerMock),
            clearMocks,
        };

        await use(mockApi);

        // Cleanup after test
        await clearMocks();
    },
});

export { expect } from "@playwright/test";
