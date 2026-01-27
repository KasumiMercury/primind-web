import { z } from "zod";
import { TaskType } from "~/gen/task/v1/task_pb";

export const periodSettingTaskTypeSchema = z
    .nativeEnum(TaskType)
    .refine(
        (val) =>
            [TaskType.SHORT, TaskType.NEAR, TaskType.RELAXED].includes(val),
        {
            message:
                "Invalid task type for period setting (scheduled not allowed)",
        },
    );

export const periodSettingSchema = z.object({
    taskType: periodSettingTaskTypeSchema,
    periodMinutes: z.number().int().min(1).max(10080),
});

export type PeriodSetting = z.infer<typeof periodSettingSchema>;

export const getPeriodSettingsOutputSchema = z.object({
    settings: z.array(periodSettingSchema),
    defaults: z.array(periodSettingSchema),
    error: z.string().optional(),
});

export type GetPeriodSettingsOutput = z.infer<
    typeof getPeriodSettingsOutputSchema
>;

export const updatePeriodSettingsInputSchema = z.object({
    settings: z.array(periodSettingSchema),
});

export type UpdatePeriodSettingsInput = z.infer<
    typeof updatePeriodSettingsInputSchema
>;

export const updatePeriodSettingsOutputSchema = z.object({
    settings: z.array(periodSettingSchema),
    error: z.string().optional(),
});

export type UpdatePeriodSettingsOutput = z.infer<
    typeof updatePeriodSettingsOutputSchema
>;
