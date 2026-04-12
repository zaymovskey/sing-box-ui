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
    display_tag: "",
    listen_port: 443,
    sniff: true,
    sniff_override_destination: true,
    users: [{ display_name: "", uuid: "", flow: undefined }],
    _tls_enabled: false,
    _security_asset_id: undefined,
    multiplex: {
      enabled: false,
      padding: false,
      brutal: {
        enabled: false,
        up_mbps: 0,
        down_mbps: 0,
      },
    },
    transport: {
      type: "disabled",
    },
  },
  hysteria2: {
    type: "hysteria2",
    listen: "::",
    display_tag: "",
    listen_port: 443,
    users: [{ display_name: "", password: "" }],
    sniff: true,
    sniff_override_destination: true,
    up_mbps: 100,
    down_mbps: 100,
    ignore_client_bandwidth: false,
    obfs_enabled: false,
    obfs_password: "",
    bbr_profile: "standard",
    brutal_debug: false,
    _security_asset_id: undefined,
    masquerade: {
      type: "disabled",
      url_string: undefined,
      directory: undefined,
      url: undefined,
      rewrite_host: false,
      status_code: undefined,
      headers: undefined,
      content: undefined,
    },
  },
} satisfies Record<InboundFormValues["type"], InboundFormValues>;
