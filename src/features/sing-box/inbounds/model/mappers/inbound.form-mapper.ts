import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  type SaveInboundInput,
  type StoredInbound,
} from "@/shared/api/contracts";

import { mapHy2FormToInbound } from "./map-hy2-form-to-inbound";
import { mapVlessFormToInbound } from "./map-vless-form-to-inbound.mapper";

export function mapFormToInbound(values: InboundFormValues): SaveInboundInput {
  if (values.type === "vless") {
    return mapVlessFormToInbound(values);
  }

  return mapHy2FormToInbound(values);
}

export function mapInboundToFormValues(
  inbound: StoredInbound,
): InboundFormValues {
  const baseFields = {
    tag: inbound.tag ?? "",
    listen: inbound.listen ?? "",
    listen_port: inbound.listen_port ?? 443,
    sniff: inbound.sniff ?? false,
    sniff_override_destination: inbound.sniff_override_destination ?? false,
  };

  if (inbound.type === "vless") {
    return {
      ...baseFields,
      type: "vless",
      _tls_enabled: inbound._tls_enabled ?? false,
      users: inbound.users?.map((user) => ({
        display_name: user.display_name ?? "",
        uuid: user.uuid ?? "",
        flow: user.flow === "xtls-rprx-vision" ? "xtls-rprx-vision" : undefined,
      })) ?? [{ name: "", uuid: "", flow: undefined }],
      _security_asset_id: inbound._security_asset_id ?? "",
    };
  }

  if (inbound.type === "hysteria2") {
    return {
      ...baseFields,
      type: "hysteria2",
      up_mbps: inbound.up_mbps ?? 1,
      down_mbps: inbound.down_mbps ?? 1,
      ignore_client_bandwidth: inbound.ignore_client_bandwidth ?? false,
      users: inbound.users?.map((user) => ({
        display_name: user.display_name ?? "",
        password: user.password ?? "",
      })) ?? [{ name: "", password: "" }],
      _security_asset_id: inbound._security_asset_id ?? "",
      obfs_enabled: Boolean(inbound.obfs?.type || inbound.obfs?.password),
      obfs_password: inbound.obfs?.password ?? "",
    };
  }

  throw new Error("Unsupported inbound type");
}
