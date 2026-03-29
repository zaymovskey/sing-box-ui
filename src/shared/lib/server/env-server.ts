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
  SINGBOX_DRAFT_CONFIG_PATH: z.string().min(1),
  SINGBOX_CONFIG_PATH: z.string().min(1),
  SINGBOX_CERTS_DIR: z.string().min(1),
  SINGBOX_CONTAINER_NAME: z.string().min(1),
  USE_HTTPS: z.enum(["true", "false"]).default("false"),
  SECURITY_ASSETS_PATH: z.string().min(1),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

function getBuildSafeEnv(source: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...source,
    AUTH_JWT_SECRET: source.AUTH_JWT_SECRET ?? "build-placeholder",
    AUTH_DEMO_EMAIL: source.AUTH_DEMO_EMAIL ?? "build@example.com",
    AUTH_DEMO_PASSWORD: source.AUTH_DEMO_PASSWORD ?? "build-placeholder",
    SINGBOX_DRAFT_CONFIG_PATH:
      source.SINGBOX_DRAFT_CONFIG_PATH ?? "/tmp/config.draft.json",
    SINGBOX_CONFIG_PATH: source.SINGBOX_CONFIG_PATH ?? "/tmp/config.json",
    SINGBOX_CERTS_DIR: source.SINGBOX_CERTS_DIR ?? "/tmp/certs",
    SINGBOX_CONTAINER_NAME:
      source.SINGBOX_CONTAINER_NAME ?? "build-placeholder",
    USE_HTTPS: source.USE_HTTPS ?? "false",
    SECURITY_ASSETS_PATH: source.SECURITY_ASSETS_PATH ?? "/tmp/security-assets",
  };
}

function normalizeServerEnv(env: ServerEnv): ServerEnv {
  return {
    ...env,
    SINGBOX_DRAFT_CONFIG_PATH: path.resolve(env.SINGBOX_DRAFT_CONFIG_PATH),
    SINGBOX_CONFIG_PATH: path.resolve(env.SINGBOX_CONFIG_PATH),
    SINGBOX_CERTS_DIR: path.resolve(env.SINGBOX_CERTS_DIR),
    SECURITY_ASSETS_PATH: path.resolve(env.SECURITY_ASSETS_PATH),
  };
}

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  const source = isBuild ? getBuildSafeEnv(process.env) : process.env;

  try {
    cached = normalizeServerEnv(serverEnvSchema.parse(source));
    return cached;
  } catch (error) {
    console.error("server env parse error", error);
    throw error;
  }
}
