import z from "zod";

import {
  createStoredInbound,
  getStoredInbounds,
} from "@/server/db/sing-box/inbounds";
import {
  OkResponseSchema,
  SaveInboundInputSchema,
} from "@/shared/api/contracts";
import { withRoute } from "@/shared/server";

export const POST = withRoute({
  auth: true,
  requestSchema: SaveInboundInputSchema,
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
