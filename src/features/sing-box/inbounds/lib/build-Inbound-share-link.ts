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

    const port = hy2Inbound.listen_port;
    const params = new URLSearchParams();

    if (hy2Inbound.obfs?.password) {
      params.set("obfs", "salamander");
      params.set("obfs-password", hy2Inbound.obfs.password);
    }

    return `hy2://${hyUser.password}@${host}:${port}/?${params.toString()}#${hy2Inbound.tag}`;
  }

  return null;
}
