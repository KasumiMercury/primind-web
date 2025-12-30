import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { data } from "react-router";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { MINIMUM_SCHEDULE_LEAD_TIME_MINUTES } from "~/features/task/constants";
import { CreateTaskRequestSchema, TaskType } from "~/gen/task/v1/task_pb";
import { withMockErrorContext } from "~/lib/mock-wrapper.server";
import { createAuthContext } from "~/lib/request-context.server";
import { taskLogger } from "./logger.server";
import { getTaskClient } from "./task-client.server";

export async function createTaskAction(request: Request) {
    return withMockErrorContext(request, async () => {
        const { contextValues, sessionToken } =
            await createAuthContext(request);

        if (!sessionToken) {
            taskLogger.warn("CreateTask action called without session token");
            return data({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const taskId = formData.get("task_id");
        const taskTypeRaw = formData.get("task_type");
        const color = formData.get("color");
        const scheduledAtRaw = formData.get("scheduled_at");

        try {
            taskLogger.debug(
                { taskTypeRaw },
                "CreateTask action received task type",
            );

            if (typeof taskId !== "string") {
                taskLogger.warn(
                    { taskId: taskId },
                    "CreateTask action received invalid task ID",
                );
                throw new Error("Invalid task ID");
            }

            if (!uuidValidate(taskId) || uuidVersion(taskId) !== 7) {
                taskLogger.warn(
                    { taskId: taskId },
                    "CreateTask action received invalid UUIDv7 task ID",
                );
                throw new Error("Invalid task ID");
            }

            taskLogger.debug({ taskId: taskId }, "Creating task with valid ID");

            if (typeof taskTypeRaw !== "string") {
                taskLogger.warn(
                    { taskType: taskTypeRaw },
                    "CreateTask action received invalid task type",
                );
                throw new Error("Invalid task type");
            }

            const taskType = Number.parseInt(taskTypeRaw, 10);
            if (!Number.isFinite(taskType)) {
                taskLogger.warn(
                    { taskType: taskTypeRaw },
                    "CreateTask action received non-numeric task type",
                );
                throw new Error("Task type must be a number");
            }

            if (
                ![
                    TaskType.SHORT,
                    TaskType.NEAR,
                    TaskType.RELAXED,
                    TaskType.SCHEDULED,
                ].includes(taskType)
            ) {
                taskLogger.warn(
                    { taskType },
                    "CreateTask action received invalid task type enum value",
                );
                throw new Error("Invalid task type value");
            }

            if (typeof color !== "string") {
                taskLogger.warn(
                    { color },
                    "CreateTask action received invalid color",
                );
                throw new Error("Invalid color");
            }

            const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
            if (!hexColorRegex.test(color)) {
                taskLogger.warn(
                    { color },
                    "CreateTask action received invalid hex color format",
                );
                throw new Error("Invalid color format");
            }

            let scheduledAt: Date | undefined;
            if (scheduledAtRaw !== null && scheduledAtRaw !== "") {
                if (typeof scheduledAtRaw !== "string") {
                    taskLogger.warn(
                        { scheduledAt: scheduledAtRaw },
                        "CreateTask action received invalid scheduled_at",
                    );
                    throw new Error("Invalid scheduled_at");
                }

                const parsedDate = new Date(scheduledAtRaw);
                if (Number.isNaN(parsedDate.getTime())) {
                    taskLogger.warn(
                        { scheduledAt: scheduledAtRaw },
                        "CreateTask action received invalid scheduled_at date format",
                    );
                    throw new Error("Invalid scheduled_at date format");
                }

                scheduledAt = parsedDate;

                const truncateToMinute = (date: Date) => {
                    const d = new Date(date);
                    d.setSeconds(0, 0);
                    return d;
                };
                const normalizedScheduledAt = truncateToMinute(scheduledAt);
                const minimumTime = truncateToMinute(new Date());
                minimumTime.setMinutes(
                    minimumTime.getMinutes() +
                        MINIMUM_SCHEDULE_LEAD_TIME_MINUTES,
                );

                if (normalizedScheduledAt < minimumTime) {
                    taskLogger.warn(
                        { scheduledAtRaw },
                        `CreateTask action received scheduled_at less than ${MINIMUM_SCHEDULE_LEAD_TIME_MINUTES} minutes from now`,
                    );
                    throw new Error(
                        `Schedule time must be at least ${MINIMUM_SCHEDULE_LEAD_TIME_MINUTES} minutes from now`,
                    );
                }
            }

            taskLogger.debug({ taskType, color, scheduledAt }, "Creating task");

            const createRequest = create(CreateTaskRequestSchema, {
                taskId: taskId,
                taskType: taskType as TaskType,
                title: "",
                description: "",
                color: color,
                scheduledAt: scheduledAt
                    ? timestampFromDate(scheduledAt)
                    : undefined,
            });

            const taskClient = await getTaskClient();
            const response = await taskClient.createTask(createRequest, {
                contextValues,
            });

            taskLogger.info(
                { taskId: response.task?.taskId, taskType },
                "Task created successfully",
            );

            return data(
                { success: true, taskId: response.task?.taskId },
                { status: 200 },
            );
        } catch (err) {
            taskLogger.error(
                { err, taskType: taskTypeRaw },
                "CreateTask action failed",
            );
            return data(
                {
                    error:
                        err instanceof Error
                            ? err.message
                            : "Failed to create task",
                },
                { status: 400 },
            );
        }
    });
}
