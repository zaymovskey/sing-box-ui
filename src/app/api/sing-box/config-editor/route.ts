import fs from "node:fs/promises";

import {
  errorJson,
  okJsonText,
  serverEnv,
  withApiErrors,
  withSession,
} from "@/shared/lib/server";

export const GET = withApiErrors(
  withSession(async () => {
    const path = serverEnv.SINGBOX_CONFIG_PATH;

    try {
      const content = await fs.readFile(path, "utf-8");
      return okJsonText(content);
    } catch {
      return errorJson(500, {
        message: "Не удалось прочитать конфиг sing-box",
        code: "SINGBOX_CONFIG_READ_FAILED",
      });
    }
  }),
);
