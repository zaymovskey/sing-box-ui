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
  };
}
