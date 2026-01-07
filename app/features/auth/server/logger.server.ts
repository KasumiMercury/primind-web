import pino from "pino";
import { getEnv } from "~/lib/runtime-env.server";

export const authLogger = pino({
    level: getEnv("LOG_LEVEL") || "info",
    name: "auth",
});
