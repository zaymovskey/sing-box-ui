import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SINGBOX_CERTS_DIR: z.string(),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

export const clientEnv: ClientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_SINGBOX_CERTS_DIR: process.env.NEXT_PUBLIC_SINGBOX_CERTS_DIR,
});
