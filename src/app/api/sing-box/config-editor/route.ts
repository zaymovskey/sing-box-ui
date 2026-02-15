import fs from "node:fs/promises";

import { Configuration } from "@black-duty/sing-box-schema";
import { type z } from "zod";

import { ConfigSchema, OkResponseSchema } from "@/shared/api/contracts";
import { ServerApiError, serverEnv, withRoute } from "@/shared/lib/server";

const throwInvalidConfigResponse = (error: z.ZodError): never => {
  throw new ServerApiError(
    422,
    "SINGBOX_CONFIG_INVALID",
    "Некорректный формат конфига sing-box",
    error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path.join("."),
    })),
  );
};

export const GET = withRoute({
  auth: true,
  responseSchema: ConfigSchema,
  handler: async () => {
    const path = serverEnv.SINGBOX_CONFIG_PATH;

    try {
      const content = await fs.readFile(path, "utf-8");
      const parsed = JSON.parse(content);
      const parseResult = Configuration.safeParse(parsed);

      if (!parseResult.success) {
        throwInvalidConfigResponse(parseResult.error);
      }

      return parsed;
    } catch {
      throw new ServerApiError(
        500,
        "SINGBOX_CONFIG_READ_FAILED",
        "Не удалось прочитать конфиг sing-box",
      );
    }
  },
});

export const PUT = withRoute({
  auth: true,
  requestSchema: ConfigSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    const path = serverEnv.SINGBOX_CONFIG_PATH;
    const parseResult = Configuration.safeParse(body);

    if (!parseResult.success) {
      throwInvalidConfigResponse(parseResult.error);
    }

    try {
      const content = JSON.stringify(parseResult.data, null, 2);
      await fs.writeFile(path, content, "utf-8");
      return { ok: true };
    } catch {
      throw new ServerApiError(
        500,
        "SINGBOX_CONFIG_WRITE_FAILED",
        "Не удалось записать конфиг sing-box",
      );
    }
  },
});
