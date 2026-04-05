import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type SaveVlessInbound } from "@/shared/api/contracts";

export function mapVlessFormToInbound(
  values: Extract<InboundFormValues, { type: "vless" }>,
): SaveVlessInbound {
  return {
    type: "vless",
    tag: values.tag,
    listen: values.listen,
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    users: values.users.map((user) => ({
      display_name: user.display_name,
      uuid: user.uuid,
      flow: user.flow,
    })),
    _tls_enabled: values._tls_enabled,
    _security_asset_id: values._security_asset_id,
  };
}
