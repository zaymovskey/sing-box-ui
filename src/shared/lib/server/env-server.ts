import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  AUTH_COOKIE_NAME: z.string().min(1).default("sbui_session"),
  AUTH_JWT_SECRET: z.string().min(1),
  AUTH_DEMO_EMAIL: z.email(),
  AUTH_DEMO_PASSWORD: z.string().min(1),
  SINGBOX_CONFIG_PATH: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv: ServerEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
  AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
  AUTH_DEMO_EMAIL: process.env.AUTH_DEMO_EMAIL,
  AUTH_DEMO_PASSWORD: process.env.AUTH_DEMO_PASSWORD,
  SINGBOX_CONFIG_PATH: process.env.SINGBOX_CONFIG_PATH,
});
