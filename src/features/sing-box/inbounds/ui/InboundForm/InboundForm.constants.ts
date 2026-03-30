import type { InboundFormValues } from "@/features/sing-box/config-core";
import { type SelectFieldItem } from "@/shared/ui";

export const typeItems: SelectFieldItem[] = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
];

export const defaultsByType = {
  vless: {
    type: "vless",
    listen: "::",
    tag: "",
    listen_port: 443,
    sniff: true,
    sniff_override_destination: true,
    users: [{ name: "", uuid: "", flow: "" }],
    _tls_enabled: false,
    _security_asset_id: undefined,
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
  },
} satisfies Record<InboundFormValues["type"], InboundFormValues>;
