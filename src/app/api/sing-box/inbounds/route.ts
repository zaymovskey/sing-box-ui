import z from "zod";

import {
  createDraftInbound,
  getDraftInbounds,
} from "@/server/db/sing-box/inbounds/repository";
import { DraftInboundSchema, OkResponseSchema } from "@/shared/api/contracts";
import { withRoute } from "@/shared/lib/server";

export const POST = withRoute({
  auth: true,
  requestSchema: DraftInboundSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    return createDraftInbound(body);
  },
});

export const GET = withRoute({
  auth: true,
  responseSchema: z.unknown(),
  handler: async () => {
    const inbounds = getDraftInbounds();

    return {
      list: inbounds,
    };
  },
});
