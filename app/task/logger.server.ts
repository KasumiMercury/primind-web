import pino from "pino";

export const taskLogger = pino({
    level: process.env.LOG_LEVEL || "info",
    name: "task",
});
