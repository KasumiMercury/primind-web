import { authRouter } from "./procedures/auth";
import { deviceRouter } from "./procedures/device";
import { periodSettingRouter } from "./procedures/period-setting";
import { taskRouter } from "./procedures/task";

export const router = {
    task: taskRouter,
    device: deviceRouter,
    auth: authRouter,
    periodSetting: periodSettingRouter,
};

export type AppRouter = typeof router;
