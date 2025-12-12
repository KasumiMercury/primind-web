import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig({
    plugins: [
        tailwindcss(),
        !isStorybook && reactRouter(),
        tsconfigPaths(),
        babel({
            filter: /\.[jt]sx?$/,
            babelConfig: {
                presets: ["@babel/preset-typescript"],
                plugins: [["babel-plugin-react-compiler"]],
            },
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: 5173,
        // watch: {
        //     // usePolling: true,
        // },
    },
});
