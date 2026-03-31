import { type SecurityAsset } from "../../../api/contracts/security-assets/security-assets.schema";
import { type DraftInbound } from "../../../api/contracts/sing-box/core";

export function resolveSecurityAssets(
  config: Record<string, unknown>,
  assets: SecurityAsset[],
): Record<string, unknown> {
  if (!Array.isArray(config.inbounds)) return config;

  const nextInbounds = config.inbounds.map((inbound) => {
    if (!inbound || typeof inbound !== "object") return inbound;

    const i = inbound as DraftInbound & {
      _security_asset_id?: string;
      _tls_enabled?: boolean;
    };

    if (!i._security_asset_id) return inbound;

    const asset = assets.find((a) => a.id === i._security_asset_id);

    if (!asset) {
      throw new Error(`Security asset not found: ${i._security_asset_id}`);
    }

    if (i.type === "vless") {
      if (asset.type !== "reality") {
        throw new Error("VLESS требует Reality asset");
      }

      return {
        ...i,
        tls: {
          enabled: true,
          server_name: asset.serverName,
          reality: {
            enabled: true,
            private_key: asset.privateKey,
            short_id: asset.shortId,
          },
        },
      };
    }

    if (i.type === "hysteria2") {
      if (asset.type !== "tls") {
        throw new Error("Hysteria2 требует TLS asset");
      }

      if (asset.source.sourceType === "inline") {
        return {
          ...i,
          tls: {
            enabled: true,
            server_name: asset.serverName,
            certificate: asset.source.certificatePem,
            key: asset.source.keyPem,
          },
        };
      }

      return {
        ...i,
        tls: {
          enabled: true,
          server_name: asset.serverName,
          certificate_path: asset.source.certificatePath,
          key_path: asset.source.keyPath,
        },
      };
    }

    return inbound;
  });

  return {
    ...config,
    inbounds: nextInbounds,
  };
}
