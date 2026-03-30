import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import z from "zod";

import {
  type SecurityAsset,
  type SecurityAssets,
  SecurityAssetSchema,
  SecurityAssetsSchema,
  SecurityAssetTypeSchema,
} from "@/shared/api/contracts";
import { getServerEnv, withRoute } from "@/shared/lib/server";

async function readSecurityAssetsFile(): Promise<SecurityAssets> {
  const serverEnv = getServerEnv();
  const securityAssetsPath = serverEnv.SECURITY_ASSETS_PATH;

  const content = await fs.readFile(securityAssetsPath, "utf-8");
  const raw = JSON.parse(content) as unknown;

  const parseResult = SecurityAssetsSchema.safeParse(raw);

  if (!parseResult.success) {
    throw new Error(
      `Invalid TLS / Realitys content: ${JSON.stringify(parseResult.error.issues)}`,
    );
  }

  return parseResult.data;
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

export const GET = withRoute({
  auth: true,
  responseSchema: SecurityAssetsSchema,
  paramsSchema: z.object({
    type: SecurityAssetTypeSchema.optional(),
  }),
  handler: async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const assets = await readSecurityAssetsFile();

    if (type) {
      return assets.filter((asset) => asset.type === type);
    }

    return assets;
  },
});

export const POST = withRoute({
  auth: true,
  requestSchema: SecurityAssetSchema,
  responseSchema: SecurityAssetSchema,
  handler: async ({ body }) => {
    const securityAssets = await readSecurityAssetsFile();

    const now = new Date().toISOString();

    const newAsset: SecurityAsset = {
      ...body,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    const nextSecurityAssets = [...securityAssets, newAsset];

    await writeSecurityAssetsFile(nextSecurityAssets);

    return newAsset;
  },
});
