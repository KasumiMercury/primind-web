import { create } from "@bufbuild/protobuf";
import { settingsLogger } from "~/features/settings/server/logger.server";
import { getPeriodSettingClient } from "~/features/settings/server/period-setting-client.server";
import {
    GetUserPeriodSettingsRequestSchema,
    PeriodSettingSchema,
    type TaskType,
    UpdateUserPeriodSettingsRequestSchema,
} from "~/gen/task/v1/task_pb";
import { ERROR_CODES } from "~/lib/errors";
import { authedProcedure } from "../middleware/auth";
import {
    getPeriodSettingsOutputSchema,
    type PeriodSetting,
    updatePeriodSettingsInputSchema,
    updatePeriodSettingsOutputSchema,
} from "../schemas/period-setting";

function protoPeriodSettingsToOutput(
    settings: { taskType: TaskType; periodMinutes: bigint }[],
): PeriodSetting[] {
    return settings.map((s) => ({
        taskType: s.taskType,
        periodMinutes: Number(s.periodMinutes),
    }));
}

export const getPeriodSettingsProcedure = authedProcedure
    .output(getPeriodSettingsOutputSchema)
    .handler(async ({ context }) => {
        try {
            const request = create(GetUserPeriodSettingsRequestSchema, {});

            const client = await getPeriodSettingClient();
            const response = await client.getUserPeriodSettings(request, {
                contextValues: context.contextValues,
            });

            settingsLogger.info(
                {
                    settingsCount: response.settings.length,
                    defaultsCount: response.defaults.length,
                },
                "GetUserPeriodSettings completed successfully",
            );

            return {
                settings: protoPeriodSettingsToOutput(response.settings),
                defaults: protoPeriodSettingsToOutput(response.defaults),
            };
        } catch (err) {
            settingsLogger.error({ err }, "GetUserPeriodSettings failed");
            return {
                settings: [],
                defaults: [],
                error: ERROR_CODES.SETTINGS_GET_FAILED,
            };
        }
    });

export const updatePeriodSettingsProcedure = authedProcedure
    .input(updatePeriodSettingsInputSchema)
    .output(updatePeriodSettingsOutputSchema)
    .handler(async ({ input, context }) => {
        try {
            settingsLogger.debug(
                { settings: input.settings },
                "Updating period settings",
            );

            const protoSettings = input.settings.map((s) =>
                create(PeriodSettingSchema, {
                    taskType: s.taskType as TaskType,
                    periodMinutes: BigInt(s.periodMinutes),
                }),
            );

            const request = create(UpdateUserPeriodSettingsRequestSchema, {
                settings: protoSettings,
            });

            const client = await getPeriodSettingClient();
            const response = await client.updateUserPeriodSettings(request, {
                contextValues: context.contextValues,
            });

            settingsLogger.info(
                { count: response.settings.length },
                "UpdateUserPeriodSettings completed successfully",
            );

            return {
                settings: protoPeriodSettingsToOutput(response.settings),
            };
        } catch (err) {
            settingsLogger.error({ err }, "UpdateUserPeriodSettings failed");
            return {
                settings: [],
                error: ERROR_CODES.SETTINGS_UPDATE_FAILED,
            };
        }
    });

export const periodSettingRouter = {
    get: getPeriodSettingsProcedure,
    update: updatePeriodSettingsProcedure,
};
