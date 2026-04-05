import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type SaveHysteria2Inbound } from "@/shared/api/contracts";

export function mapHy2FormToInbound(
  values: Extract<InboundFormValues, { type: "hysteria2" }>,
): SaveHysteria2Inbound {
  return {
    type: "hysteria2",
    display_tag: values.display_tag,
    listen: values.listen,
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    up_mbps: values.ignore_client_bandwidth ? undefined : values.up_mbps,
    down_mbps: values.ignore_client_bandwidth ? undefined : values.down_mbps,
    ignore_client_bandwidth: values.ignore_client_bandwidth,
    users: values.users.map((user) => ({
      display_name: user.display_name,
      password: user.password,
    })),
    _security_asset_id: values._security_asset_id,
    obfs: values.obfs_enabled
      ? {
          type: "salamander",
          password: values.obfs_password?.trim() || undefined,
        }
      : undefined,
  };
}
