import { z } from "zod";

export const LoginResponseSchema = z.object({
  ok: z.boolean().optional(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
