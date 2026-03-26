import fs from "node:fs/promises";
import path from "node:path";

import { saveConfigRevision } from "@/features/sing-box/config-core/server";
import { DraftInboundSchema, OkResponseSchema } from "@/shared/api/contracts";
import { getServerEnv, withRoute } from "@/shared/lib/server";

export const POST = withRoute({
  auth: true,
  requestSchema: DraftInboundSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    const serverEnv = getServerEnv();
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

    const draftContent = await fs.readFile(draftPath, "utf-8");
    const rawDraftConfig = JSON.parse(draftContent);

    const inbounds = Array.isArray(rawDraftConfig.inbounds)
      ? rawDraftConfig.inbounds
      : [];

    const nextDraftConfig = {
      ...rawDraftConfig,
      inbounds: [...inbounds, body],
    };

    const historyDirPath = path.join(path.dirname(draftPath), "history");

    await saveConfigRevision({
      historyDirPath,
      currentConfig: rawDraftConfig,
      action: "create-inbound",
      label: `create-inbound:${body.tag ?? "unknown"}`,
      maxRevisions: 3,
    });

    await fs.writeFile(
      draftPath,
      JSON.stringify(nextDraftConfig, null, 2),
      "utf-8",
    );

    return { ok: true };
  },
});
