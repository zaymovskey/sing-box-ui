import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";

import {
  OkResponseSchema,
  RuntimeConfigSchema,
  stripDraftFields,
} from "@/shared/api/contracts";
import {
  getServerEnv,
  resolveSecurityAssets,
  ServerApiError,
  withRoute,
} from "@/shared/lib/server";

const execFileAsync = promisify(execFile);

export const POST = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async () => {
    const serverEnv = getServerEnv();

    const configPath = serverEnv.SINGBOX_CONFIG_PATH;
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;
    const assetsPath = serverEnv.SECURITY_ASSETS_PATH;
    const containerName = serverEnv.SINGBOX_CONTAINER_NAME;

    const draftContent = await fs.readFile(draftPath, "utf-8");
    const rawDraftConfig = JSON.parse(draftContent) as Record<string, unknown>;

    const assetsContent = await fs.readFile(assetsPath, "utf-8");
    const securityAssets = JSON.parse(assetsContent);

    console.log("RAW DRAFT CONFIG", JSON.stringify(rawDraftConfig, null, 2));
    console.log("SECURITY ASSETS", JSON.stringify(securityAssets, null, 2));

    const resolvedConfig = resolveSecurityAssets(
      rawDraftConfig,
      securityAssets,
    );

    console.log("RESOLVED CONFIG", JSON.stringify(resolvedConfig, null, 2));

    const runtimeConfig = stripDraftFields(resolvedConfig);

    console.log("RUNTIME CONFIG", JSON.stringify(runtimeConfig, null, 2));

    const parseResult = RuntimeConfigSchema.safeParse(runtimeConfig);

    if (!parseResult.success) {
      throw new ServerApiError(
        422,
        "SINGBOX_CONFIG_INVALID",
        "Черновик нельзя применить: итоговый конфиг невалиден",
        parseResult.error.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
          path: issue.path.join("."),
        })),
      );
    }

    await fs.writeFile(
      configPath,
      JSON.stringify(parseResult.data, null, 2),
      "utf-8",
    );

    await execFileAsync("docker", ["restart", containerName]);

    return { ok: true };
  },
});
