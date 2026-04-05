import z from "zod";

import {
  createStoredInbound,
  getStoredInbounds,
} from "@/server/db/sing-box/inbounds/repository";
import { OkResponseSchema, StoredInboundSchema } from "@/shared/api/contracts";
import { withRoute } from "@/shared/lib/server";

export const POST = withRoute({
  auth: true,
  requestSchema: StoredInboundSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body }) => {
    return createStoredInbound(body);
  },
});

export const GET = withRoute({
  auth: true,
  responseSchema: z.unknown(),
  handler: async () => {
    const inbounds = getStoredInbounds();

    return {
      list: inbounds,
    };
  },
});
