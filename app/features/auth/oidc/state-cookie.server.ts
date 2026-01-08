import { createCookie } from "react-router";
import { isProduction } from "~/lib/runtime-env.server";

export const oidcStateCookie = createCookie("oidc_state", {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    secure: isProduction(),
    httpOnly: true,
});
