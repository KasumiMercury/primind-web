import pino from "pino";
import { getEnv } from "~/lib/runtime-env.server";

export const taskLogger = pino({
    level: getEnv("LOG_LEVEL") || "info",
    name: "task",
});
