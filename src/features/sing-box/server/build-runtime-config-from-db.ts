import fs from "node:fs/promises";

import { getSecurityAssets } from "@/server/db/security-assets";
import { getStoredInbounds } from "@/server/db/sing-box/inbounds";
import { getServerEnv } from "@/shared/server";

import {
  type SingBoxHysteria2Inbound,
  type SingBoxInbound,
  type SingBoxVlessInbound,
  type StoredHysteria2Inbound,
  type StoredInbound,
  type StoredVlessInbound,
} from "../../../shared/api/contracts";
import { stripDraftFields } from "../../../shared/api/contracts/sing-box/core/strip-draft-fields.mapper";
import { resolveSecurityAssets } from "./resolve-security-assets";

type V2RayApiStatsConfig = {
  enabled?: boolean;
  inbounds?: string[];
  outbounds?: string[];
  users?: string[];
};

type V2RayApiConfig = {
  listen?: string;
  stats?: V2RayApiStatsConfig;
};

type ExperimentalConfig = {
  v2ray_api?: V2RayApiConfig;
};

function uniq(values: string[]): string[] {
  return [...new Set(values)];
}

function mapHy2MasqueradeToRuntime(
  masquerade: StoredHysteria2Inbound["masquerade"],
): SingBoxHysteria2Inbound["masquerade"] | undefined {
  if (!masquerade) {
    return undefined;
  }

  if (typeof masquerade === "string") {
    const value = masquerade.trim();
    return value.length > 0 ? value : undefined;
  }

  const type = masquerade.type?.trim();

  if (!type) {
    return undefined;
  }

  if (type === "file") {
    const directory = masquerade.directory?.trim() ?? masquerade.file?.trim();

    if (!directory) {
      return undefined;
    }

    return {
      type: "file",
      directory,
    };
  }

  if (type === "proxy") {
    const url = masquerade.url?.trim();

    if (!url) {
      return undefined;
    }

    return {
      type: "proxy",
      url,
    };
  }

  if (type === "string") {
    return {
      type: "string",
    };
  }

  return undefined;
}

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
  const statsConfig = buildV2RayStatsFromStoredInbounds(dbInbounds);
  const dbSecurityAssets = getSecurityAssets();

  const rawExperimental =
    typeof rawDraft.experimental === "object" && rawDraft.experimental !== null
      ? (rawDraft.experimental as ExperimentalConfig)
      : undefined;

  const rawV2RayApi =
    rawExperimental && typeof rawExperimental.v2ray_api === "object"
      ? rawExperimental.v2ray_api
      : undefined;

  const rawStats =
    rawV2RayApi && typeof rawV2RayApi.stats === "object"
      ? rawV2RayApi.stats
      : undefined;

  const draftWithDbSources: Record<string, unknown> = {
    ...rawDraft,
    inbounds: runtimeInbounds,
    experimental: {
      ...(rawExperimental ?? {}),
      v2ray_api: {
        ...(rawV2RayApi ?? {}),
        stats: {
          ...(rawStats ?? {}),
          enabled: true,
          inbounds: statsConfig.inbounds,
          users: statsConfig.users,
        },
      },
    },
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
        tag: stored.internal_tag,
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
      tag: stored.internal_tag,
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
      masquerade: mapHy2MasqueradeToRuntime(stored.masquerade),
      bbr_profile: stored.bbr_profile,
      brutal_debug: stored.brutal_debug,
    };

    return runtime;
  });
}

export function buildV2RayStatsFromStoredInbounds(inbounds: StoredInbound[]): {
  inbounds: string[];
  users: string[];
} {
  const inboundTags: string[] = [];
  const userNames: string[] = [];

  for (const inbound of inbounds) {
    inboundTags.push(inbound.internal_tag);

    for (const user of inbound.users) {
      userNames.push(user.internal_name);
    }
  }

  return {
    inbounds: uniq(inboundTags),
    users: uniq(userNames),
  };
}
