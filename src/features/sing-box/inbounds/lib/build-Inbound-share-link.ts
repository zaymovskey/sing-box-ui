import {
  type SecurityAsset,
  type StoredInbound,
  type StoredInboundUser,
  type StoredVlessInbound,
} from "@/shared/api/contracts";

function getHeader(
  headers: Record<string, string> | undefined,
  name: string,
): string | undefined {
  if (!headers) {
    return undefined;
  }

  const direct = headers[name];
  if (direct?.trim()) {
    return direct.trim();
  }

  const matchedKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === name.toLowerCase(),
  );

  const value = matchedKey ? headers[matchedKey] : undefined;
  return value?.trim() || undefined;
}

function applyVlessTransportParams(
  params: URLSearchParams,
  transport: StoredVlessInbound["transport"],
): void {
  if (!transport) {
    params.set("type", "tcp");
    return;
  }

  params.set("type", transport.type);

  if (transport.type === "ws") {
    if (transport.path) {
      params.set("path", transport.path);
    }

    const hostHeader = getHeader(transport.headers, "Host");
    if (hostHeader) {
      params.set("host", hostHeader);
    }

    if (transport.max_early_data !== undefined) {
      params.set("ed", String(transport.max_early_data));
    }

    if (transport.early_data_header_name) {
      params.set("eh", transport.early_data_header_name);
    }

    return;
  }

  if (transport.type === "grpc") {
    params.set("serviceName", transport.service_name);
    return;
  }

  if (transport.type === "http") {
    if (transport.path) {
      params.set("path", transport.path);
    }

    if (transport.host) {
      const host = Array.isArray(transport.host)
        ? transport.host.join(",")
        : transport.host;
      if (host) {
        params.set("host", host);
      }
    }

    const hostHeader = getHeader(transport.headers, "Host");
    if (hostHeader && !params.has("host")) {
      params.set("host", hostHeader);
    }

    return;
  }

  if (transport.type === "httpupgrade") {
    if (transport.path) {
      params.set("path", transport.path);
    }

    if (transport.host) {
      params.set("host", transport.host);
    }

    const hostHeader = getHeader(transport.headers, "Host");
    if (hostHeader && !params.has("host")) {
      params.set("host", hostHeader);
    }
  }
}

export function buildInboundShareLink(
  inbound: StoredInbound,
  user: StoredInboundUser,
  securityAssets: SecurityAsset[],
  host: string,
): string | null {
  if (!host || !inbound.listen_port) {
    return null;
  }

  if (inbound.type === "vless") {
    const vlessInbound = inbound as Extract<StoredInbound, { type: "vless" }>;
    const vlessUser = user as StoredInboundUser & {
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

    params.set("encryption", "none");
    applyVlessTransportParams(params, vlessInbound.transport);

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
    } else if (vlessInbound._tls_enabled) {
      params.set("security", "tls");
    } else if (host !== "localhost") {
      params.set("security", "none");
    }

    let linkName = vlessInbound.display_tag + "_" + vlessUser.display_name;
    linkName = encodeURIComponent(linkName === "_" ? "INBOUND_USER" : linkName);

    return `vless://${vlessUser.uuid}@${host}:${port}?${params.toString()}#${linkName}`;
  }

  if (inbound.type === "hysteria2") {
    const hy2Inbound = inbound as Extract<StoredInbound, { type: "hysteria2" }>;
    const hyUser = user as StoredInboundUser & {
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

    let linkName = hy2Inbound.display_tag + "_" + hyUser.display_name;
    linkName = encodeURIComponent(linkName === "_" ? "INBOUND_USER" : linkName);
    return `hy2://${hyUser.password}@${host}:${port}/?${params.toString()}#${linkName}`;
  }

  return null;
}
