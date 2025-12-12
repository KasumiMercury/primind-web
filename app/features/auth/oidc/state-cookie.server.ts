import { createCookie } from "react-router";

export const oidcStateCookie = createCookie("oidc_state", {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
});
