import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { saveConfigRevision } from "@/features/sing-box/config-core/server";
import { DraftConfigSchema, OkResponseSchema } from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

export const GET = withRoute({
  auth: true,
  responseSchema: z.unknown(),
  handler: async () => {
    const serverEnv = getServerEnv();
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

    const draftContent = await fs.readFile(draftPath, "utf-8");
    const rawDraftContent = JSON.parse(draftContent);

    return rawDraftContent;
  },
});

export const PUT = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    const serverEnv = getServerEnv();
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

    const previousContent = await fs.readFile(draftPath, "utf-8");

    const historyDirPath = path.join(path.dirname(draftPath), "history");

    await saveConfigRevision({
      historyDirPath,
      currentConfig: JSON.parse(previousContent),
      action: "update-config",
      label: "update-config",
      maxRevisions: 3,
    });

    const parseResult = DraftConfigSchema.safeParse(body);

    if (!parseResult.success) {
      throwInvalidDraftResponse(parseResult.error);
    }

    await fs.writeFile(draftPath, JSON.stringify(body, null, 2), "utf-8");

    return { ok: true };
  },
});

const throwInvalidDraftResponse = (error: z.ZodError): never => {
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
