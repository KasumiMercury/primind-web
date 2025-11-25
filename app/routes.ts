import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/login/google", "routes/login.google.ts"),
    route("/callback/google", "routes/callback.google.ts"),
] satisfies RouteConfig;
