import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { saveConfigRevision } from "@/features/sing-box/config-core/server";
import { ConfigSchema, OkResponseSchema } from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

const throwInvalidConfigResponse = (error: z.ZodError): never => {
  const details = error.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: issue.path.join("."),
  }));

  throw new ServerApiError(
    422,
    "SINGBOX_CONFIG_INVALID",
    "Некорректный формат конфига sing-box",
    details,
  );
};

/**
 * Получение конфигурации sing-box
 * @description Возвращает текущую конфигурацию sing-box. Требуется аутентификация.
 * @responseSet getSingBoxConfig
 * @tag SingBox
 *
 * @response 200:DocConfigSchema
 * @add 401:ApiErrorPayloadSchema
 * @add 503:ApiErrorPayloadSchema
 *
 * @openapi
 */
export const GET = withRoute({
  auth: true,
  responseSchema: ConfigSchema,
  handler: async () => {
    const serverEnv = getServerEnv();
    const path = serverEnv.SINGBOX_CONFIG_PATH;

    const content = await fs.readFile(path, "utf-8");
    const parsed = JSON.parse(content);
    const parseResult = ConfigSchema.safeParse(parsed);

    if (!parseResult.success) {
      throwInvalidConfigResponse(parseResult.error);
    }

    return parsed;
  },
});

/**
 * Обновление конфигурации sing-box
 * @description Обновляет текущую конфигурацию sing-box. Требуется аутентификация.
 * @responseSet updateSingBoxConfig
 * @tag SingBox
 *
 * @body DocConfigSchema
 * @response 200:OkResponseSchema
 * @add 401:ApiErrorPayloadSchema
 * @add 503:ApiErrorPayloadSchema
 *
 * @openapi
 */
export const PUT = withRoute({
  auth: true,
  requestSchema: ConfigSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    const serverEnv = getServerEnv();
    const configPath = serverEnv.SINGBOX_CONFIG_PATH;

    const parseResult = ConfigSchema.safeParse(body);

    if (!parseResult.success) {
      throwInvalidConfigResponse(parseResult.error);
    }

    const previousContent = await fs.readFile(configPath, "utf-8");

    const historyDirPath = path.join(path.dirname(configPath), "history");

    await saveConfigRevision({
      historyDirPath,
      currentConfig: JSON.parse(previousContent),
      action: "update-config",
      label: "update-config",
      maxRevisions: 3,
    });

    const content = JSON.stringify(parseResult.data, null, 2);
    await fs.writeFile(configPath, content, "utf-8");

    return { ok: true };
  },
});

/**
 * Костыль для документации, так как реальный ConfigSchema пакет
 * next-openapi-gen не поддерживает
 */
export const DocConfigSchema = z.object({
  log: z.unknown().optional(),
  dns: z.unknown().optional(),
  inbounds: z.array(z.unknown()).optional(),
  outbounds: z.array(z.unknown()).optional(),
  route: z.unknown().optional(),
});
