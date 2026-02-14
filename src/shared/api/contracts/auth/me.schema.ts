import { z } from "zod";

export const meResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  roles: z.array(z.string()).optional(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
