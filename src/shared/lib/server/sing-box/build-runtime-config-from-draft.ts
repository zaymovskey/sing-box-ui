import fs from "node:fs/promises";

import { stripDraftFields } from "../../../api/contracts/sing-box/core/strip-draft-fields.mapper";
import { getServerEnv } from "../../server/env-server";
import { resolveSecurityAssets } from "./resolve-security-assets";

export async function buildRuntimeConfigFromDraft(): Promise<
  Record<string, unknown>
> {
  const serverEnv = getServerEnv();

  const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;
  const securityAssetsPath = serverEnv.SECURITY_ASSETS_PATH;

  const rawDraft = JSON.parse(await fs.readFile(draftPath, "utf-8")) as Record<
    string,
    unknown
  >;

  const rawSecurityAssets = JSON.parse(
    await fs.readFile(securityAssetsPath, "utf-8"),
  );

  const resolvedDraft = resolveSecurityAssets(rawDraft, rawSecurityAssets);

  return stripDraftFields(resolvedDraft);
}
