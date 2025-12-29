import path from "node:path";
import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const dirname =
    typeof __dirname !== "undefined"
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            "~/test": path.resolve(dirname, "test"),
        },
    },
    test: {
        name: "unit",
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
        include: ["app/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
        exclude: ["stories/**", "e2e/**", "node_modules/**"],
        globals: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: [
                "app/features/**/*.{ts,tsx}",
                "app/components/**/*.{ts,tsx}",
            ],
            exclude: ["**/*.stories.tsx", "**/gen/**", "**/*.d.ts"],
        },
    },
});
