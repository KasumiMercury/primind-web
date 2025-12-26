import {
    index,
    layout,
    type RouteConfig,
    route,
} from "@react-router/dev/routes";

export default [
    layout("layouts/app-layout.tsx", [
        layout("layouts/home-shell.tsx", [
            index("routes/home.tsx"),
            route("tasks/:taskId", "routes/tasks.$taskId.tsx"),
        ]),
    ]),

    route("/login", "features/auth/components/login.tsx"),
    route("/callback/google", "features/auth/oidc/callback.google.tsx"),

    route("/api/rpc/*", "routes/api/rpc.$.tsx"),
    route("/api/set-language", "routes/api/set-language.ts"),
    route("/api/*", "routes/api/openapi.$.tsx"),
] satisfies RouteConfig;
