import type { CreateInboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export const typeItems = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: CreateInboundFormValues["type"];
}>;

export const defaultsByType = {
  vless: {
    type: "vless",
    tag: "",
    listen_port: 443,
    reality_handshake_port: 443,
    sniff: true,
    sniff_override_destination: true,
    user_name: "",
    uuid: "",
    flow: "",
    tls_server_name: "www.cloudflare.com",
    reality_handshake_server: "www.cloudflare.com",
    reality_private_key: "",
  },
  hysteria2: {
    type: "hysteria2",
    tag: "",
    listen_port: 443,
    reality_handshake_port: 443,
    sniff: true,
    sniff_override_destination: true,
    user_name: "",
    password: "",
    up_mbps: 100,
    down_mbps: 100,
    obfs_password: "",
    tls_server_name: "www.cloudflare.com",
    certificate_path: "/etc/sing-box/hy2.crt",
    key_path: "/etc/sing-box/hy2.key",
  },
} satisfies Record<CreateInboundFormValues["type"], CreateInboundFormValues>;
