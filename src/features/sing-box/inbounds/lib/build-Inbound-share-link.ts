import { type DraftInbound } from "@/shared/api/contracts";

export function buildInboundShareLink(
  inbound: DraftInbound,
  user: unknown,
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

    if (vlessInbound.tls?.enabled) {
      params.set("security", "tls");

      if (vlessInbound.tls.server_name) {
        params.set("sni", vlessInbound.tls.server_name);
      }

      if (vlessInbound.tls.reality?.enabled) {
        params.set("security", "reality");

        const publicKey = vlessInbound.tls.reality._reality_public_key;

        if (!publicKey) {
          return null;
        }

        params.set("pbk", publicKey);

        const shortId = vlessInbound.tls.reality.short_id;

        if (Array.isArray(shortId)) {
          if (shortId[0]) {
            params.set("sid", shortId[0]);
          }
        } else if (shortId) {
          params.set("sid", shortId);
        }
      }
    } else {
      params.set("security", "none");
    }

    if (vlessUser.flow) {
      params.set("flow", vlessUser.flow);
    }

    params.set("type", "tcp");

    return `vless://${vlessUser.uuid}@${host}:${port}?${params.toString()}#${vlessInbound.tag}`;
  }

  if (inbound.type === "hysteria2") {
    const hy2Inbound = inbound as Extract<DraftInbound, { type: "hysteria2" }>;
    const hyUser = user as {
      password: string;
    };

    const port = hy2Inbound.listen_port;
    const params = new URLSearchParams();

    if (hy2Inbound.tls?.server_name) {
      params.set("sni", hy2Inbound.tls.server_name);
    }

    if (hy2Inbound.tls?._is_selfsigned_cert) {
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
