import type { InboundFormValues } from "@/features/sing-box/config-core";

export const typeItems = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: InboundFormValues["type"];
}>;

export const defaultsByType = {
  vless: {
    type: "vless",
    listen: "::",
    tag: "",
    listen_port: 443,
    sniff: true,
    sniff_override_destination: true,
    users: [{ name: "", uuid: "", flow: "" }],
    tls_server_name: "www.cloudflare.com",
    reality_handshake_server: "www.cloudflare.com",
    reality_private_key: "",
    tls_enabled: false,
    reality_enabled: false,
    reality_handshake_server_port: 443,
    _reality_public_key: "",
  },
  hysteria2: {
    type: "hysteria2",
    listen: "::",
    tag: "",
    listen_port: 443,
    users: [{ name: "", password: "" }],
    sniff: true,
    sniff_override_destination: true,
    up_mbps: 100,
    down_mbps: 100,
    tls_server_name: "www.cloudflare.com",
    certificate_path: "hy2.crt",
    key_path: "hy2.key",
    tls_enabled: false,
    _tlsChecked: false,
    _tlsOverwrite: false,
  },
} satisfies Record<InboundFormValues["type"], InboundFormValues>;
