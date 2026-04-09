import z from "zod";

import { applyInboundFirewallChanges } from "@/features/sing-box";
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
    const response = createStoredInbound(body);

    applyInboundFirewallChanges({
      mode: "add",
      vpnProtocol: body.type,
      listenPort: body.listen_port,
    });

    return response;
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
