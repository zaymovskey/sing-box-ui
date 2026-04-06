import { randomUUID } from "node:crypto";

import z from "zod";

import {
  createSecurityAsset,
  getSecurityAssets,
} from "@/server/db/security-assets";
import {
  type SecurityAsset,
  SecurityAssetSchema,
  SecurityAssetsSchema,
  SecurityAssetTypeSchema,
} from "@/shared/api/contracts";
import { withRoute } from "@/shared/lib/server";

export const GET = withRoute({
  auth: true,
  responseSchema: SecurityAssetsSchema,
  paramsSchema: z.object({
    type: SecurityAssetTypeSchema.optional(),
  }),
  handler: async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const rawType = searchParams.get("type");

    const type = rawType ? SecurityAssetTypeSchema.parse(rawType) : undefined;

    return getSecurityAssets(type);
  },
});

export const POST = withRoute({
  auth: true,
  requestSchema: SecurityAssetSchema,
  responseSchema: SecurityAssetSchema,
  handler: async ({ body }) => {
    const now = new Date().toISOString();

    const creatingAsset: SecurityAsset = {
      ...body,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    const newAsset = createSecurityAsset(creatingAsset);

    return newAsset;
  },
});
