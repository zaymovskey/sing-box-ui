import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";

import { OkResponseSchema, RuntimeConfigSchema } from "@/shared/api/contracts";
import {
  buildRuntimeConfigFromDb,
  getServerEnv,
  ServerApiError,
  withRoute,
} from "@/shared/server";

const execFileAsync = promisify(execFile);

export const POST = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async () => {
    const serverEnv = getServerEnv();

    const configPath = serverEnv.SINGBOX_CONFIG_PATH;
    const containerName = serverEnv.SINGBOX_CONTAINER_NAME;

    const runtimeConfig = await buildRuntimeConfigFromDb();

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
