import z from "zod";

import {
  deleteStoredInboundByTag,
  updateStoredInboundByTag,
} from "@/server/db/sing-box/inbounds/repository";
import { OkResponseSchema, StoredInboundSchema } from "@/shared/api/contracts";
import { ServerApiError, withRoute } from "@/shared/lib/server";

const TagParamsSchema = z.object({
  tag: z.string().min(1),
});

export const PUT = withRoute({
  auth: true,
  requestSchema: StoredInboundSchema,
  paramsSchema: TagParamsSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body, params }) => {
    const { tag } = params;

    const updated = updateStoredInboundByTag(tag, body);

    if (!updated) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    return { ok: true };
  },
});

export const DELETE = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  paramsSchema: TagParamsSchema,
  handler: async ({ params }) => {
    const { tag } = params;

    const deleted = deleteStoredInboundByTag(tag);

    if (!deleted) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    return { ok: true };
  },
});
