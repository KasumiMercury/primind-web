import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/tasks/:taskId", "routes/tasks.$taskId.tsx"),
    route("/login", "auth/login.tsx"),
    route("/callback/google", "auth/oidc/callback.google.tsx"),
    route("/api/task", "routes/api/task.tsx"),
    route("/api/task/update", "routes/api/task.update.tsx"),
    route("/api/task/delete", "routes/api/task.delete.tsx"),
] satisfies RouteConfig;
