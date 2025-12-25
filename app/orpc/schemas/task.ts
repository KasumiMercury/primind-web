import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { z } from "zod";
import { TaskStatus, TaskType } from "~/gen/task/v1/task_pb";

export const taskIdSchema = z
    .string()
    .refine((val) => uuidValidate(val) && uuidVersion(val) === 7, {
        message: "Invalid UUIDv7 task ID",
    });

export const hexColorSchema = z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format");

export const taskTypeSchema = z
    .nativeEnum(TaskType)
    .refine(
        (val) =>
            [
                TaskType.SHORT,
                TaskType.NEAR,
                TaskType.RELAXED,
                TaskType.SCHEDULED,
            ].includes(val),
        { message: "Invalid task type" },
    );

export const taskStatusSchema = z
    .nativeEnum(TaskStatus)
    .refine((val) => [TaskStatus.ACTIVE, TaskStatus.COMPLETED].includes(val), {
        message: "Invalid task status",
    });

export const createTaskInputSchema = z.object({
    taskId: taskIdSchema,
    taskType: taskTypeSchema,
    color: hexColorSchema,
    scheduledAt: z.string().datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
    taskId: taskIdSchema,
    title: z.string().optional(),
    description: z.string().optional(),
    taskStatus: taskStatusSchema.optional(),
    scheduledAt: z.string().datetime().optional(),
    color: hexColorSchema.optional(),
    updateMask: z.array(z.string()).min(1, "update_mask is required"),
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const deleteTaskInputSchema = z.object({
    taskId: taskIdSchema,
});

export type DeleteTaskInput = z.infer<typeof deleteTaskInputSchema>;

export const getTaskInputSchema = z.object({
    taskId: taskIdSchema,
});

export type GetTaskInput = z.infer<typeof getTaskInputSchema>;

export const completeTaskInputSchema = z.object({
    taskId: taskIdSchema,
});

export type CompleteTaskInput = z.infer<typeof completeTaskInputSchema>;

// Output schemas
export const timestampSchema = z.object({
    seconds: z.string(),
});

export const taskOutputSchema = z.object({
    taskId: z.string(),
    taskType: z.number(),
    taskStatus: z.number(),
    title: z.string(),
    description: z.string(),
    scheduledAt: timestampSchema.optional(),
    createdAt: timestampSchema.optional(),
    targetAt: timestampSchema.optional(),
    color: z.string(),
});

export type TaskOutput = z.infer<typeof taskOutputSchema>;

export const createTaskOutputSchema = z.object({
    success: z.boolean(),
    taskId: z.string().optional(),
    error: z.string().optional(),
});

export type CreateTaskOutput = z.infer<typeof createTaskOutputSchema>;

export const updateTaskOutputSchema = z.object({
    success: z.boolean(),
    taskId: z.string().optional(),
    error: z.string().optional(),
});

export type UpdateTaskOutput = z.infer<typeof updateTaskOutputSchema>;

export const deleteTaskOutputSchema = z.object({
    success: z.boolean(),
    error: z.string().optional(),
});

export type DeleteTaskOutput = z.infer<typeof deleteTaskOutputSchema>;

export const getTaskOutputSchema = z.object({
    task: taskOutputSchema.optional(),
    error: z.string().optional(),
});

export type GetTaskOutput = z.infer<typeof getTaskOutputSchema>;

export const listActiveTasksOutputSchema = z.object({
    tasks: z.array(taskOutputSchema),
    error: z.string().optional(),
});

export type ListActiveTasksOutput = z.infer<typeof listActiveTasksOutputSchema>;
