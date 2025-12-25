import { z } from "zod";

export const logoutOutputSchema = z.object({
    success: z.boolean(),
});

export type LogoutOutput = z.infer<typeof logoutOutputSchema>;
