import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type DraftInbound } from "@/shared/api/contracts";

import { mapHy2FormToInbound } from "./map-hy2-form-to-inbound";
import { mapVlessFormToInbound } from "./map-vless-form-to-inbound.mapper";

export function mapFormToInbound(values: InboundFormValues): DraftInbound {
  if (values.type === "vless") {
    return mapVlessFormToInbound(values);
  }

  return mapHy2FormToInbound(values);
}

export function mapInboundToFormValues(
  inbound: DraftInbound,
): InboundFormValues {
  const baseFields = {
    tag: inbound.tag ?? "",
    listen: inbound.listen ?? "",
    listen_port: inbound.listen_port ?? 0,
    sniff: inbound.sniff ?? false,
    sniff_override_destination: inbound.sniff_override_destination ?? false,
  };

  if (inbound.type === "vless") {
    return {
      ...baseFields,
      type: "vless",
      _tls_enabled: inbound._tls_enabled ?? false,
      users: inbound.users?.map((user) => ({
        name: user.name ?? "",
        uuid: user.uuid ?? "",
        flow: user.flow ?? "",
      })) ?? [{ name: "", uuid: "", flow: "" }],
      _security_asset_id: inbound._security_asset_id ?? "",
    };
  }

  if (inbound.type === "hysteria2") {
    return {
      ...baseFields,
      type: "hysteria2",
      up_mbps: inbound.up_mbps ?? 0,
      down_mbps: inbound.down_mbps ?? 0,
      users: inbound.users?.map((user) => ({
        name: user.name ?? "",
        password: user.password ?? "",
      })) ?? [{ name: "", password: "" }],
      _security_asset_id: inbound._security_asset_id ?? "",
    };
  }

  throw new Error("Unsupported inbound type");
}
