import { type ConfigInbound } from "@/features/sing-box/config-core";
import { type PanelMetadata } from "@/shared/api/contracts";

export function buildInboundShareLink(
  inbound: ConfigInbound,
  user: unknown,
  host: string,
  realityPublicKeys: PanelMetadata["realityPublicKeys"],
): string | null {
  if (inbound.type === "vless") {
    const vlessUser = user as {
      uuid: string;
      flow?: string;
    };

    const port = inbound.listen_port;
    const params = new URLSearchParams();

    if (inbound.tls?.enabled) {
      params.set("security", "tls");

      if (inbound.tls.server_name) {
        params.set("sni", inbound.tls.server_name);
      }

      if (inbound.tls.reality?.enabled) {
        params.set("security", "reality");

        const privateKey = inbound.tls.reality.private_key;
        if (!privateKey) {
          return null;
        }

        const publicKey = realityPublicKeys[privateKey];
        if (!publicKey) {
          return null;
        }

        params.set("pbk", publicKey);

        const shortId = inbound.tls.reality.short_id;

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

    return `vless://${vlessUser.uuid}@${host}:${port}?${params.toString()}#${inbound.tag}`;
  }

  if (inbound.type === "hysteria2") {
    const hyUser = user as {
      password: string;
    };

    const port = inbound.listen_port;
    const params = new URLSearchParams();

    if (inbound.tls?.server_name) {
      params.set("sni", inbound.tls.server_name);
    }

    params.set("insecure", "1");

    if (inbound.obfs?.password) {
      params.set("obfs", "salamander");
      params.set("obfs-password", inbound.obfs.password);
    }

    return `hy2://${hyUser.password}@${host}:${port}/?${params.toString()}#${inbound.tag}`;
  }

  return null;
}
