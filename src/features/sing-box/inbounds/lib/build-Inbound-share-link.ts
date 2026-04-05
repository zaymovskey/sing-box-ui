import { type SecurityAsset, type StoredInbound } from "@/shared/api/contracts";

export function buildInboundShareLink(
  inbound: StoredInbound,
  user: unknown,
  securityAssets: SecurityAsset[],
  host: string,
): string | null {
  if (!host || !inbound.listen_port) {
    return null;
  }

  if (inbound.type === "vless") {
    const vlessInbound = inbound as Extract<StoredInbound, { type: "vless" }>;
    const vlessUser = user as {
      uuid: string;
      flow?: string;
    };

    if (!vlessUser?.uuid) {
      return null;
    }

    const realityAsset = securityAssets.find(
      (asset) =>
        asset.id === vlessInbound._security_asset_id &&
        asset.type === "reality",
    );

    const port = vlessInbound.listen_port;
    const params = new URLSearchParams();

    params.set("type", "tcp");
    params.set("encryption", "none");

    if (vlessUser.flow) {
      params.set("flow", vlessUser.flow);
    }

    if (realityAsset?.type === "reality") {
      params.set("security", "reality");

      const sni =
        realityAsset.serverName || realityAsset.handshake?.server || undefined;

      if (sni) {
        params.set("sni", sni);
      }

      if (realityAsset._publicKey) {
        params.set("pbk", realityAsset._publicKey);
      }

      if (realityAsset.shortId) {
        params.set("sid", realityAsset.shortId);
      }

      if (realityAsset.fingerprint) {
        params.set("fp", realityAsset.fingerprint);
      }

      if (realityAsset.spiderX) {
        params.set("spx", realityAsset.spiderX);
      }
    } else {
      params.set("security", "none");
    }

    return `vless://${vlessUser.uuid}@${host}:${port}?${params.toString()}#${encodeURIComponent(vlessInbound.tag ?? "")}`;
  }

  if (inbound.type === "hysteria2") {
    const hy2Inbound = inbound as Extract<StoredInbound, { type: "hysteria2" }>;
    const hyUser = user as {
      password: string;
    };

    if (!hyUser?.password) {
      return null;
    }

    const tlsAsset = securityAssets.find(
      (asset) =>
        asset.id === hy2Inbound._security_asset_id && asset.type === "tls",
    );

    const port = hy2Inbound.listen_port;
    const params = new URLSearchParams();

    if (tlsAsset?.type === "tls" && tlsAsset.serverName) {
      params.set("sni", tlsAsset.serverName);
    }

    if (
      tlsAsset?.type === "tls" &&
      tlsAsset.source._is_selfsigned_cert === true
    ) {
      params.set("insecure", "1");
    }

    if (hy2Inbound.obfs?.password) {
      params.set("obfs", "salamander");
      params.set("obfs-password", hy2Inbound.obfs.password);
    }

    return `hy2://${hyUser.password}@${host}:${port}/?${params.toString()}#${encodeURIComponent(hy2Inbound.tag ?? "")}`;
  }

  return null;
}
