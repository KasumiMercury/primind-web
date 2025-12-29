import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        tailwindcss(),
        storybookTest({ configDir: path.join(dirname, ".storybook") }),
    ],
    test: {
        name: "storybook",
        setupFiles: ["./.storybook/vitest.setup.ts"],
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            headless: true,
        },
    },
});
