export const ERROR_CODES = {
    TASK_CREATE_FAILED: "task.create.failed",
    TASK_GET_FAILED: "task.get.failed",
    TASK_UPDATE_FAILED: "task.update.failed",
    TASK_DELETE_FAILED: "task.delete.failed",
    TASK_LIST_FAILED: "task.list.failed",
    TASK_COMPLETE_FAILED: "task.complete.failed",
    TASK_NOT_FOUND: "task.notFound",

    AUTH_SESSION_INVALID: "auth.session.invalid",
    AUTH_LOGIN_FAILED: "auth.login.failed",
    AUTH_LOGOUT_FAILED: "auth.logout.failed",

    DEVICE_REGISTER_FAILED: "device.register.failed",
    DEVICE_STORAGE_UNAVAILABLE: "device.storage.unavailable",

    SETTINGS_GET_FAILED: "settings.get.failed",
    SETTINGS_UPDATE_FAILED: "settings.update.failed",

    COMMON_UNEXPECTED: "common.unexpected",
    COMMON_NETWORK_ERROR: "common.networkError",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
