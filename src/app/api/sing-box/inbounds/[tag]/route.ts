import z from "zod";

import {
  deleteDraftInboundByTag,
  updateDraftInboundByTag,
} from "@/db/sing-box/inbounds/repository";
import { DraftInboundSchema, OkResponseSchema } from "@/shared/api/contracts";
import { ServerApiError, withRoute } from "@/shared/lib/server";

const TagParamsSchema = z.object({
  tag: z.string().min(1),
});

export const PUT = withRoute({
  auth: true,
  requestSchema: DraftInboundSchema,
  paramsSchema: TagParamsSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body, params }) => {
    const { tag } = params;

    const updated = updateDraftInboundByTag(tag, body);

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

    const deleted = deleteDraftInboundByTag(tag);

    if (!deleted) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    return { ok: true };
  },
});
