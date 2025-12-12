import { test as base } from "@playwright/test";
import type { MockErrorMode } from "../../app/lib/mock-error-config";

export const test = base.extend<{
    setErrorMode: (mode: MockErrorMode) => Promise<void>;
}>({
    setErrorMode: async ({ context }, use) => {
        const setMode = async (mode: MockErrorMode) => {
            await context.setExtraHTTPHeaders({
                "Mock-Error-Mode": mode,
            });
        };
        await use(setMode);
    },
});

export { expect } from "@playwright/test";
