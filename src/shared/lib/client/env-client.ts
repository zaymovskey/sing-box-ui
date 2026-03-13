import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_HOST_IP: z.string().optional(),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv: ClientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_HOST_IP: process.env.NEXT_PUBLIC_HOST_IP,
});
