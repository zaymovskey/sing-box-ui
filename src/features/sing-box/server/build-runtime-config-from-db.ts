import fs from "node:fs/promises";

import { getSecurityAssets } from "@/server/db/security-assets";
import { getStoredInbounds } from "@/server/db/sing-box/inbounds";

import {
  type SingBoxHysteria2Inbound,
  type SingBoxInbound,
  type SingBoxVlessInbound,
  type StoredHysteria2Inbound,
  type StoredInbound,
  type StoredVlessInbound,
} from "../../../shared/api/contracts";
import { stripDraftFields } from "../../../shared/api/contracts/sing-box/core/strip-draft-fields.mapper";
import { getServerEnv } from "../../../shared/lib/server/env-server";
import { resolveSecurityAssets } from "./resolve-security-assets";

export async function buildRuntimeConfigFromDb(): Promise<
  Record<string, unknown>
> {
  const serverEnv = getServerEnv();
  const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

  const rawDraft = JSON.parse(await fs.readFile(draftPath, "utf-8")) as Record<
    string,
    unknown
  >;

  const dbInbounds = getStoredInbounds();
  const runtimeInbounds = mapStoredInboundsToSingBox(dbInbounds);
  const dbSecurityAssets = getSecurityAssets();

  const draftWithDbSources: Record<string, unknown> = {
    ...rawDraft,
    inbounds: runtimeInbounds,
  };

  const resolvedDraft = resolveSecurityAssets(
    draftWithDbSources,
    dbSecurityAssets,
  );

  return stripDraftFields(resolvedDraft);
}

export function mapStoredInboundsToSingBox(
  inbounds: StoredInbound[],
): SingBoxInbound[] {
  return inbounds.map((inbound) => {
    if (inbound.type === "vless") {
      const stored = inbound as StoredVlessInbound;

      const runtime: SingBoxVlessInbound = {
        type: "vless",
        tag: stored.tag,
        listen: stored.listen,
        listen_port: stored.listen_port,
        sniff: stored.sniff,
        sniff_override_destination: stored.sniff_override_destination,
        users: stored.users.map((user) => ({
          name: user.internal_name,
          uuid: user.uuid,
          flow: user.flow,
        })),
        tls: stored.tls
          ? {
              enabled: stored.tls.enabled,
              server_name: stored.tls.server_name,
              reality: stored.tls.reality
                ? {
                    enabled: stored.tls.reality.enabled,
                    handshake: stored.tls.reality.handshake,
                    private_key: stored.tls.reality.private_key,
                    short_id: stored.tls.reality.short_id,
                    max_time_difference: stored.tls.reality.max_time_difference,
                  }
                : undefined,
            }
          : undefined,
      };

      return runtime;
    }

    const stored = inbound as StoredHysteria2Inbound;

    const runtime: SingBoxHysteria2Inbound = {
      type: "hysteria2",
      tag: stored.tag,
      listen: stored.listen,
      listen_port: stored.listen_port,
      sniff: stored.sniff,
      sniff_override_destination: stored.sniff_override_destination,
      up_mbps: stored.up_mbps,
      down_mbps: stored.down_mbps,
      ignore_client_bandwidth: stored.ignore_client_bandwidth,
      users: stored.users.map((user) => ({
        name: user.internal_name,
        password: user.password,
      })),
      obfs: stored.obfs,
      tls: stored.tls
        ? {
            enabled: stored.tls.enabled,
            server_name: stored.tls.server_name,
            certificate: stored.tls.certificate,
            key: stored.tls.key,
            certificate_path: stored.tls.certificate_path,
            key_path: stored.tls.key_path,
          }
        : undefined,
      masquerade: stored.masquerade,
      bbr_profile: stored.bbr_profile,
      brutal_debug: stored.brutal_debug,
    };

    return runtime;
  });
}
