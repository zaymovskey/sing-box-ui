import fs from "node:fs/promises";

import { Configuration } from "@black-duty/sing-box-schema";

import {
  errorJson,
  okJson,
  serverEnv,
  withApiErrors,
  withSession,
} from "@/shared/lib/server";

export const GET = withApiErrors(
  withSession(async () => {
    const path = serverEnv.SINGBOX_CONFIG_PATH;

    try {
      const content = await fs.readFile(path, "utf-8");
      const parsed = JSON.parse(content);
      return okJson(parsed);
    } catch {
      return errorJson(500, {
        error: {
          message: "Не удалось прочитать конфиг sing-box",
          code: "SINGBOX_CONFIG_READ_FAILED",
        },
      });
    }
  }),
);

export const PUT = withApiErrors(
  withSession(async ({ request }) => {
    const path = serverEnv.SINGBOX_CONFIG_PATH;
    const body = await request.json();
    const parseResult = Configuration.safeParse(body);

    if (!parseResult.success) {
      return errorJson(422, {
        error: {
          message: "Некорректный формат конфига sing-box",
          code: "SINGBOX_CONFIG_INVALID",
          issues: parseResult.error.issues.map((issue) => ({
            code: issue.code,
            message: issue.message,
            path: issue.path.join("."),
          })),
        },
      });
    }

    try {
      const content = JSON.stringify(parseResult.data, null, 2);
      await fs.writeFile(path, content, "utf-8");
      return okJson({ ok: true });
    } catch {
      return errorJson(500, {
        error: {
          message: "Не удалось записать конфиг sing-box",
          code: "SINGBOX_CONFIG_WRITE_FAILED",
        },
      });
    }
  }),
);
