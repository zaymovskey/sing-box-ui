import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type DraftInbound } from "@/shared/api/contracts";

export function mapHy2FormToInbound(
  values: Extract<InboundFormValues, { type: "hysteria2" }>,
): DraftInbound {
  return {
    type: "hysteria2",
    tag: values.tag,
    listen: values.listen,
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    up_mbps: values.up_mbps,
    down_mbps: values.down_mbps,
    users: values.users.map((user) => ({
      name: user.name,
      password: user.password,
    })),
    _security_asset_id: values._security_asset_id,
    obfs: values.obfs_enabled
      ? {
          type: "salamander",
          password: values.obfs_password,
        }
      : undefined,
  };
}
