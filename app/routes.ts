import {
    index,
    layout,
    type RouteConfig,
    route,
} from "@react-router/dev/routes";

const isDev = process.env.NODE_ENV === "development";

const apiRoutes: RouteConfig = [
    route("/api/rpc/*", "routes/api/rpc.$.tsx"),
    route("/api/set-language", "routes/api/set-language.ts"),
    ...(isDev ? [route("/api/test-mock", "routes/api/test-mock.ts")] : []),
    route("/api/*", "routes/api/openapi.$.tsx"),
];

export default [
    layout("layouts/app-layout.tsx", [
        layout("layouts/home-shell.tsx", [
            index("routes/home.tsx"),
            route("tasks/:taskId", "routes/tasks.$taskId.tsx"),
        ]),
    ]),

    route("/login", "features/auth/components/login.tsx"),
    route("/callback/google", "features/auth/oidc/callback.google.tsx"),

    ...apiRoutes,
] satisfies RouteConfig;
