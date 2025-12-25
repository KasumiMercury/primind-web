import { authRouter } from "./procedures/auth";
import { deviceRouter } from "./procedures/device";
import { taskRouter } from "./procedures/task";

export const router = {
    task: taskRouter,
    device: deviceRouter,
    auth: authRouter,
};

export type AppRouter = typeof router;
