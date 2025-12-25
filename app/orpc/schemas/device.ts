import { z } from "zod";

export const platformSchema = z.enum(["web", "android", "ios"]);

export const registerDeviceInputSchema = z.object({
    timezone: z.string().min(1, "timezone is required"),
    locale: z.string().min(1, "locale is required"),
    platform: platformSchema,
    fcmToken: z.string().optional(),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceInputSchema>;

export const registerDeviceOutputSchema = z.object({
    success: z.boolean(),
    deviceId: z.string().optional(),
    isNew: z.boolean().optional(),
    error: z.string().optional(),
});

export type RegisterDeviceOutput = z.infer<typeof registerDeviceOutputSchema>;
