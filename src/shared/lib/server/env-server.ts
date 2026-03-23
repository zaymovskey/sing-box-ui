import path from "node:path";

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
  SINGBOX_CERTS_DIR: z.string(),
  SINGBOX_CONTAINER_NAME: z.string().min(1),
});

type ServerEnvSchema = z.infer<typeof serverEnvSchema>;

let cached: ServerEnvSchema | null = null;

export function getServerEnv(): ServerEnvSchema {
  if (cached) return cached;

  const raw: Record<keyof ServerEnvSchema, string | undefined> = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
    AUTH_DEMO_EMAIL: process.env.AUTH_DEMO_EMAIL,
    AUTH_DEMO_PASSWORD: process.env.AUTH_DEMO_PASSWORD,
    SINGBOX_CONFIG_PATH: process.env.SINGBOX_CONFIG_PATH,
    SINGBOX_CERTS_DIR: process.env.SINGBOX_CERTS_DIR,
    SINGBOX_CONTAINER_NAME: process.env.SINGBOX_CONTAINER_NAME,
  };

  const isBuild = process.env.NEXT_PHASE === "phase-production-build";

  try {
    const parsed = isBuild
      ? serverEnvSchema.parse({
          ...raw,
          AUTH_JWT_SECRET: raw.AUTH_JWT_SECRET ?? "build-placeholder",
          AUTH_DEMO_EMAIL: raw.AUTH_DEMO_EMAIL ?? "build@example.com",
          AUTH_DEMO_PASSWORD: raw.AUTH_DEMO_PASSWORD ?? "build-placeholder",
          SINGBOX_CONFIG_PATH: raw.SINGBOX_CONFIG_PATH ?? "/tmp/config.json",
          SINGBOX_CONTAINER_NAME:
            raw.SINGBOX_CONTAINER_NAME ?? "build-placeholder",
        })
      : serverEnvSchema.parse(raw);

    cached = {
      ...parsed,
      SINGBOX_CONFIG_PATH: path.resolve(parsed.SINGBOX_CONFIG_PATH),
    };

    return cached;
  } catch (error) {
    console.error("server env parse error", error);
    throw error;
  }
}
