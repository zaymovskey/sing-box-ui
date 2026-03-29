import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import {
  OkResponseSchema,
  type SecurityAsset,
  type SecurityAssets,
  SecurityAssetSchema,
  SecurityAssetsSchema,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

const idParamsSchema = z.object({
  id: z.string().min(1),
});

async function readSecurityAssetsFile(): Promise<SecurityAssets> {
  const serverEnv = getServerEnv();
  const securityAssetsPath = serverEnv.SECURITY_ASSETS_PATH;

  try {
    const content = await fs.readFile(securityAssetsPath, "utf-8");
    const raw = JSON.parse(content) as unknown;

    const parseResult = SecurityAssetsSchema.safeParse(raw);

    if (!parseResult.success) {
      throw new Error(
        `Invalid TLS / Realitys content: ${JSON.stringify(parseResult.error.issues)}`,
      );
    }

    return parseResult.data;
  } catch (error) {
    // файл ещё не существует считаем пустым
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeSecurityAssetsFile(
  securityAssets: SecurityAssets,
): Promise<void> {
  const serverEnv = getServerEnv();
  const securityAssetsPath = serverEnv.SECURITY_ASSETS_PATH;

  await fs.mkdir(path.dirname(securityAssetsPath), { recursive: true });

  await fs.writeFile(
    securityAssetsPath,
    JSON.stringify(securityAssets, null, 2),
    "utf-8",
  );
}

export const PUT = withRoute({
  auth: true,
  paramsSchema: idParamsSchema,
  requestSchema: SecurityAssetSchema,
  responseSchema: SecurityAssetSchema,
  handler: async ({ body, params }) => {
    const { id } = params;

    const securityAssets = await readSecurityAssetsFile();

    const currentAsset = securityAssets.find((asset) => asset.id === id);

    if (!currentAsset) {
      throw new ServerApiError(404, "NOT_FOUND", "TLS / Reality not found");
    }

    const updatedAsset: SecurityAsset = {
      ...body,
      id: currentAsset.id,
      createdAt: currentAsset.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const nextSecurityAssets = securityAssets.map((asset) =>
      asset.id === id ? updatedAsset : asset,
    );

    await writeSecurityAssetsFile(nextSecurityAssets);

    return updatedAsset;
  },
});

export const DELETE = withRoute({
  auth: true,
  paramsSchema: idParamsSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ params }) => {
    const { id } = params;

    const securityAssets = await readSecurityAssetsFile();

    const hasAsset = securityAssets.some((asset) => asset.id === id);

    if (!hasAsset) {
      throw new ServerApiError(404, "NOT_FOUND", "TLS / Reality not found");
    }

    const nextSecurityAssets = securityAssets.filter(
      (asset) => asset.id !== id,
    );

    await writeSecurityAssetsFile(nextSecurityAssets);

    return { ok: true };
  },
});
