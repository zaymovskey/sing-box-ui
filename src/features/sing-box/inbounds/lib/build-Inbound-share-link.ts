import { type DraftInbound, type SecurityAsset } from "@/shared/api/contracts";

export function buildInboundShareLink(
  inbound: DraftInbound,
  user: unknown,
  securityAssets: SecurityAsset[],
  host: string,
): string | null {
  if (inbound.type === "vless") {
    const vlessInbound = inbound as Extract<DraftInbound, { type: "vless" }>;
    const vlessUser = user as {
      uuid: string;
      flow?: string;
    };

    const port = vlessInbound.listen_port;
    const params = new URLSearchParams();

    if (vlessUser.flow) {
      params.set("flow", vlessUser.flow);
    }

    params.set("security", "none");
    params.set("type", "tcp");

    return `vless://${vlessUser.uuid}@${host}:${port}?${params.toString()}#${vlessInbound.tag}`;
  }

  if (inbound.type === "hysteria2") {
    const hy2Inbound = inbound as Extract<DraftInbound, { type: "hysteria2" }>;
    const hyUser = user as {
      password: string;
    };

    const tlsAsset = securityAssets.find(
      (asset) =>
        asset.id === hy2Inbound._security_asset_id && asset.type === "tls",
    );

    console.log("Building share link for hysteria2 inbound", {
      inbound,
      user,
      tlsAsset,
      host,
    });

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

    return `hy2://${hyUser.password}@${host}:${port}/?${params.toString()}#${hy2Inbound.tag}`;
  }

  return null;
}
