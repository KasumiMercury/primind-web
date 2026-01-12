import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";
import babel from "vite-plugin-babel";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const isStorybook = process.argv[1]?.includes("storybook");

const isProd = process.env.NODE_ENV === "production";
const runtimeTarget = process.env.VITE_RUNTIME;
const isCloudflare = runtimeTarget === "cloudflare";

export default defineConfig({
    define: isProd
        ? {
              "import.meta.env.VITE_USE_MOCK_API": JSON.stringify("false"),
          }
        : undefined,
    plugins: [
        tailwindcss(),
        VitePWA({
            strategies: "injectManifest",
            srcDir: "app",
            filename: "sw.ts",
            manifest: false,
            injectRegister: false,
            injectManifest: {
                injectionPoint: undefined,
            },
            devOptions: {
                enabled: true,
                type: "module",
            },
        }) as PluginOption,
        !isStorybook && reactRouter(),
        tsconfigPaths(),
        !isStorybook &&
            babel({
                filter: /\.[jt]sx?$/,
                babelConfig: {
                    presets: ["@babel/preset-typescript"],
                    plugins: [["babel-plugin-react-compiler"]],
                },
            }),
    ],
    ssr: isCloudflare
        ? {
              target: "webworker",
              noExternal: true,
              external: [
                  "util",
                  "crypto",
                  "async_hooks",
                  "stream",
                  "node:async_hooks",
                  "node:crypto",
                  "node:fs/promises",
                  "node:http",
                  "node:https",
                  "node:url",
                  "node:zlib",
                  "node:util",
                  "node:http2",
                  "@connectrpc/connect-node",
              ],
          }
        : undefined,
    server: {
        host: "0.0.0.0",
        port: 5173,
    },
});
