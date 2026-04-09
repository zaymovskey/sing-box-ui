import z from "zod";

import { applyInboundFirewallChanges } from "@/features/sing-box";
import {
  deleteStoredInboundByInternalTag,
  getStoredInboundByInternalTag,
  updateStoredInboundByDisplayTag,
} from "@/server/db/sing-box/inbounds";
import {
  OkResponseSchema,
  SaveInboundInputSchema,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/server";

const TagParamsSchema = z.object({
  internalTag: z.string().min(1),
});

export const PUT = withRoute({
  auth: true,
  requestSchema: SaveInboundInputSchema,
  paramsSchema: TagParamsSchema,
  responseSchema: OkResponseSchema,
  handler: async ({ body, params }) => {
    const { internalTag } = params;

    const old = getStoredInboundByInternalTag(internalTag);

    if (!old) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    const updated = updateStoredInboundByDisplayTag(internalTag, body);

    if (!updated) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    if (old.listen_port !== body.listen_port) {
      if (!old.listen_port) {
        throw new ServerApiError(
          500,
          "INBOUND_LISTEN_PORT_MISSING",
          "Old inbound listen port is missing",
        );
      }

      const env = getServerEnv();

      if (env.ENABLE_FIREWALL === "true") {
        await applyInboundFirewallChanges({
          mode: "update",
          vpnProtocol: old.type,
          listenPort: body.listen_port,
          prevPort: old.listen_port,
        });
      }
    }

    return { ok: true };
  },
});

export const DELETE = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  paramsSchema: TagParamsSchema,
  handler: async ({ params }) => {
    const { internalTag } = params;

    const old = getStoredInboundByInternalTag(internalTag);

    if (!old) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    const deleted = deleteStoredInboundByInternalTag(internalTag);

    if (!deleted) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    if (old.listen_port == null) {
      throw new ServerApiError(
        500,
        "INBOUND_LISTEN_PORT_MISSING",
        "Old inbound listen port is missing",
      );
    }

    const env = getServerEnv();

    if (env.ENABLE_FIREWALL === "true") {
      await applyInboundFirewallChanges({
        mode: "remove",
        vpnProtocol: old.type,
        prevPort: old.listen_port,
      });
    }

    return { ok: true };
  },
});
