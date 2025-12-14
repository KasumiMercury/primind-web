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
    route("/api/task", "routes/api/task.tsx"),
    route("/api/task/update", "routes/api/task.update.tsx"),
    route("/api/task/delete", "routes/api/task.delete.tsx"),
    route("/api/logout", "routes/api/logout.tsx"),
    route("/api/device", "routes/api/device.tsx"),
] satisfies RouteConfig;
