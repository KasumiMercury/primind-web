import pino from "pino";

export const authLogger = pino({
    level: process.env.LOG_LEVEL || "info",
    name: "auth",
});
