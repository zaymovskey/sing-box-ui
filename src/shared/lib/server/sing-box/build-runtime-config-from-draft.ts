import fs from "node:fs/promises";

import { getSecurityAssets } from "@/db/security-assets/repository";
import { getDraftInbounds } from "@/db/sing-box/inbounds/repository";

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

  const dbInbounds = getDraftInbounds();
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
