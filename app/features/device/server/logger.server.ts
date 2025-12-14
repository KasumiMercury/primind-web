import pino from "pino";

export const deviceLogger = pino({
    level: process.env.LOG_LEVEL || "info",
    name: "device",
});
