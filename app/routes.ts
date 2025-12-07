import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login", "auth/login.tsx"),
    route("/callback/google", "auth/oidc/callback.google.tsx"),
    route("/api/task", "routes/api/task.tsx"),
] satisfies RouteConfig;
