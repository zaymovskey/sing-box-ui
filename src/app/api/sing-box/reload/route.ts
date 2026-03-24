import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";

import { OkResponseSchema } from "@/shared/api/contracts";
import { getServerEnv, withRoute } from "@/shared/lib/server";

const execFileAsync = promisify(execFile);

export const POST = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async () => {
    const serverEnv = getServerEnv();
    const configPath = serverEnv.SINGBOX_CONFIG_PATH;
    const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;
    const containerName = serverEnv.SINGBOX_CONTAINER_NAME;

    await fs.copyFile(draftPath, configPath);

    await execFileAsync("docker", ["restart", containerName]);

    return { ok: true };
  },
});
