import fs from "node:fs/promises";

import { getSecurityAssets } from "@/server/db/security-assets";
import { getStoredInbounds } from "@/server/db/sing-box/inbounds";

import { stripDraftFields } from "../../../api/contracts/sing-box/core/strip-draft-fields.mapper";
import { getServerEnv } from "../../server/env-server";
import { resolveSecurityAssets } from "./resolve-security-assets";

export async function buildRuntimeConfigFromDraft(): Promise<
  Record<string, unknown>
> {
  const serverEnv = getServerEnv();
  const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

  const rawDraft = JSON.parse(await fs.readFile(draftPath, "utf-8")) as Record<
    string,
    unknown
  >;

  const dbInbounds = getStoredInbounds();
  const dbSecurityAssets = getSecurityAssets();

  const draftWithDbSources: Record<string, unknown> = {
    ...rawDraft,
    inbounds: dbInbounds,
  };

  const resolvedDraft = resolveSecurityAssets(
    draftWithDbSources,
    dbSecurityAssets,
  );

  return stripDraftFields(resolvedDraft);
}
