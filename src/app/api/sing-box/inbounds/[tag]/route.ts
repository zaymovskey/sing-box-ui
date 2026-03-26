import fs from "node:fs/promises";
import path from "node:path";

import z from "zod";

import { saveConfigRevision } from "@/features/sing-box/config-core/server";
import {
  type DraftInbound,
  DraftInboundSchema,
  OkResponseSchema,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

const TagParamsSchema = z.object({
  tag: z.string().min(1),
});

export const PUT = withRoute({
  auth: true,
  requestSchema: DraftInboundSchema,
  paramsSchema: TagParamsSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body, params }) => {
    const { tag } = params;

    const serverEnv = getServerEnv();
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

    const draftContent = await fs.readFile(draftPath, "utf-8");
    const rawDraftConfig = JSON.parse(draftContent) as {
      inbounds?: DraftInbound[];
    };

    const inbounds = Array.isArray(rawDraftConfig.inbounds)
      ? rawDraftConfig.inbounds
      : [];

    const exists = inbounds.some((inb) => inb.tag === tag);

    if (!exists) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    const nextDraftConfig = {
      ...rawDraftConfig,
      inbounds: inbounds.map((inb) => (inb.tag === tag ? body : inb)),
    };

    const historyDirPath = path.join(path.dirname(draftPath), "history");

    await saveConfigRevision({
      historyDirPath,
      currentConfig: rawDraftConfig,
      action: "edit-inbound",
      label: `edit-inbound:${tag}`,
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

export const DELETE = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  paramsSchema: TagParamsSchema,
  handler: async ({ params }) => {
    const { tag } = params;

    const serverEnv = getServerEnv();
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

    const draftContent = await fs.readFile(draftPath, "utf-8");
    const rawDraftConfig = JSON.parse(draftContent) as {
      inbounds?: DraftInbound[];
    };

    const inbounds = Array.isArray(rawDraftConfig.inbounds)
      ? rawDraftConfig.inbounds
      : [];

    const exists = inbounds.some((inb) => inb.tag === tag);

    if (!exists) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    const nextDraftConfig = {
      ...rawDraftConfig,
      inbounds: inbounds.filter((inb) => inb.tag !== tag),
    };

    const historyDirPath = path.join(path.dirname(draftPath), "history");

    await saveConfigRevision({
      historyDirPath,
      currentConfig: rawDraftConfig,
      action: "delete-inbound",
      label: `delete-inbound:${tag}`,
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
