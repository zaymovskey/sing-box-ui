import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  type SaveHysteria2Inbound,
  type SaveInboundInput,
  type StoredInbound,
} from "@/shared/api/contracts";

import { mapHy2FormToInbound } from "./map-hy2-form-to-inbound";
import { mapVlessFormToInbound } from "./map-vless-form-to-inbound.mapper";

function mapInboundMasqueradeToForm(
  masquerade: SaveHysteria2Inbound["masquerade"],
): Extract<InboundFormValues, { type: "hysteria2" }>["masquerade"] {
  if (!masquerade) {
    return {
      type: "disabled",
    };
  }

  if (typeof masquerade === "string") {
    return {
      type: "url",
      url_string: masquerade,
    };
  }

  const raw = masquerade as Record<string, unknown>;

  if (masquerade.type === "file") {
    return {
      type: "file_server",
      directory: masquerade.directory ?? "",
    };
  }

  if (masquerade.type === "proxy") {
    return {
      type: "reverse_proxy",
      url: masquerade.url ?? "",
      rewrite_host: raw.rewrite_host === true,
    };
  }

  if (masquerade.type === "string") {
    return {
      type: "fixed_response",
      status_code:
        typeof raw.status_code === "number" ? raw.status_code : undefined,
      content: typeof raw.content === "string" ? raw.content : "",
      headers: typeof raw.headers === "string" ? raw.headers : "",
    };
  }

  return {
    type: "fixed_response",
    status_code:
      typeof raw.status_code === "number" ? raw.status_code : undefined,
    content: typeof raw.content === "string" ? raw.content : "",
    headers: typeof raw.headers === "string" ? raw.headers : "",
  };
}

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
    display_tag: inbound.display_tag ?? "",
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
      _security_asset_id: inbound._security_asset_id ?? undefined,
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
      _security_asset_id: inbound._security_asset_id ?? undefined,
      obfs_enabled: Boolean(inbound.obfs?.type || inbound.obfs?.password),
      obfs_password: inbound.obfs?.password ?? "",
      masquerade: mapInboundMasqueradeToForm(inbound.masquerade),
    };
  }

  throw new Error("Unsupported inbound type");
}
