import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type DraftInbound } from "@/shared/api/contracts";

export function mapVlessFormToInbound(
  values: Extract<InboundFormValues, { type: "vless" }>,
): DraftInbound {
  return {
    type: "vless",
    tag: values.tag,
    listen: values.listen,
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    users: values.users.map((user) => ({
      name: user.name,
      uuid: user.uuid,
      flow: user.flow || undefined,
    })),
    _tls_enabled: values._tls_enabled,
    _security_asset_id: values._security_asset_id,
  };
}
