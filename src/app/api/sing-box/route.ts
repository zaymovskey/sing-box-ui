import fs from "node:fs/promises";

import { errorJson, serverEnv, withApiErrors } from "@/shared/lib/server";

export const GET = withApiErrors(async () => {
  const path = serverEnv.SINGBOX_CONFIG_PATH;

  try {
    const content = await fs.readFile(path, "utf-8");
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return errorJson(500, {
      message: "Не удалось прочитать конфиг sing-box",
      code: "SINGBOX_CONFIG_READ_FAILED",
    });
  }
});
