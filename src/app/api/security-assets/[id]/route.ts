import { z } from "zod";

import {
  deleteSecurityAssetById,
  getSecurityAssetById,
  updateSecurityAsset,
} from "@/db/security-assets/repository";
import {
  OkResponseSchema,
  type SecurityAsset,
  SecurityAssetSchema,
} from "@/shared/api/contracts";
import { ServerApiError, withRoute } from "@/shared/lib/server";

const idParamsSchema = z.object({
  id: z.string().min(1),
});

export const PUT = withRoute({
  auth: true,
  paramsSchema: idParamsSchema,
  requestSchema: SecurityAssetSchema,
  responseSchema: SecurityAssetSchema,
  handler: async ({ body, params }) => {
    const { id } = params;

    const currentAsset = getSecurityAssetById(id);

    if (!currentAsset) {
      throw new ServerApiError(404, "NOT_FOUND", "TLS / Reality not found");
    }

    const updatedAsset: SecurityAsset = {
      ...body,
      id: currentAsset.id,
      createdAt: currentAsset.createdAt,
      updatedAt: new Date().toISOString(),
    };

    try {
      return updateSecurityAsset(updatedAsset);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "SECURITY_ASSET_NOT_FOUND"
      ) {
        throw new ServerApiError(404, "NOT_FOUND", "TLS / Reality not found");
      }

      throw error;
    }
  },
});

export const DELETE = withRoute({
  auth: true,
  paramsSchema: idParamsSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ params }) => {
    const { id } = params;

    const deleted = deleteSecurityAssetById(id);

    if (!deleted) {
      throw new ServerApiError(404, "NOT_FOUND", "TLS / Reality not found");
    }

    return { ok: true };
  },
});
