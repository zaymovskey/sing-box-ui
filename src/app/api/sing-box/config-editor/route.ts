import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { saveConfigRevision } from "@/features/sing-box/config-core/server";
import {
  type ConfigWithMetadata,
  ConfigWithMetadataSchema,
  OkResponseSchema,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

const throwInvalidConfigWithMetadataResponse = (error: z.ZodError): never => {
  const details = error.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: issue.path.join("."),
  }));

  throw new ServerApiError(
    422,
    "SINGBOX_CONFIG_INVALID",
    "Некорректный формат конфига sing-box и/или метаданных",
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
  responseSchema: ConfigWithMetadataSchema,
  handler: async () => {
    const serverEnv = getServerEnv();
    const configPath = serverEnv.SINGBOX_CONFIG_PATH;
    const metadataPath = serverEnv.CONFIG_METADATA_PATH;

    const configContent = await fs.readFile(configPath, "utf-8");
    const metadataContent = await fs.readFile(metadataPath, "utf-8");

    const parsedConfigContent = JSON.parse(configContent);
    const parsedMetadataContent = JSON.parse(metadataContent);

    const parsedConfigWithMetadata: ConfigWithMetadata = {
      config: parsedConfigContent,
      metadata: parsedMetadataContent,
    };

    const parseResult = ConfigWithMetadataSchema.safeParse(
      parsedConfigWithMetadata,
    );

    if (!parseResult.success) {
      throwInvalidConfigWithMetadataResponse(parseResult.error);
    }

    return parsedConfigWithMetadata;
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
  requestSchema: ConfigWithMetadataSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    const serverEnv = getServerEnv();
    const configPath = serverEnv.SINGBOX_CONFIG_PATH;
    const metadataPath = serverEnv.CONFIG_METADATA_PATH;

    const previousContent = await fs.readFile(configPath, "utf-8");

    const historyDirPath = path.join(path.dirname(configPath), "history");

    await saveConfigRevision({
      historyDirPath,
      currentConfig: JSON.parse(previousContent),
      action: "update-config",
      label: "update-config",
      maxRevisions: 3,
    });

    const configContent = JSON.stringify(body.config, null, 2);
    await fs.writeFile(configPath, configContent, "utf-8");

    const metadataContent = JSON.stringify(body.metadata, null, 2);
    await fs.writeFile(metadataPath, metadataContent, "utf-8");

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
