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

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const raw = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
    AUTH_DEMO_EMAIL: process.env.AUTH_DEMO_EMAIL,
    AUTH_DEMO_PASSWORD: process.env.AUTH_DEMO_PASSWORD,
    SINGBOX_CONFIG_PATH: process.env.SINGBOX_CONFIG_PATH,
  };

  const isBuild = process.env.NEXT_PHASE === "phase-production-build";

  if (isBuild) {
    cached = serverEnvSchema.parse({
      ...raw,
      AUTH_JWT_SECRET: raw.AUTH_JWT_SECRET ?? "build-placeholder",
      AUTH_DEMO_EMAIL: raw.AUTH_DEMO_EMAIL ?? "build@example.com",
      AUTH_DEMO_PASSWORD: raw.AUTH_DEMO_PASSWORD ?? "build-placeholder",
      SINGBOX_CONFIG_PATH:
        raw.SINGBOX_CONFIG_PATH ?? "/data/sing-box/config.json",
    });
    return cached;
  }

  cached = serverEnvSchema.parse(raw);
  return cached;
}
