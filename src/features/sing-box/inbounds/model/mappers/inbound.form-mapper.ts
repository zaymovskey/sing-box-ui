import {
  type ConfigInbound,
  type InboundFormValues,
} from "@/features/sing-box/config-core";
import { clientEnv } from "@/shared/lib";

import { mapHy2FormToInbound } from "./map-hy2-form-to-inbound";
import { mapVlessFormToInbound } from "./map-vless-form-to-inbound.mapper";

export function mapFormToInbound(values: InboundFormValues): ConfigInbound {
  if (values.type === "vless") {
    return mapVlessFormToInbound(values);
  }
  return mapHy2FormToInbound(values);
}

export function mapInboundToFormValues(
  inbound: ConfigInbound,
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
      reality_handshake_server_port:
        inbound.tls?.reality?.handshake?.server_port ?? 443,
      reality_enabled: inbound.tls?.reality?.enabled ?? false,
      tls_enabled: inbound.tls?.enabled ?? false,
      users: inbound.users?.map((user) => ({
        name: user.name ?? "",
        uuid: user.uuid ?? "",
        flow: user.flow ?? "",
      })) ?? [{ name: "", uuid: "", flow: "" }],
      tls_server_name: inbound.tls?.server_name ?? "",
      reality_private_key: inbound.tls?.reality?.private_key ?? "",
      _reality_public_key: "",
      reality_handshake_server: inbound.tls?.reality?.handshake?.server ?? "",
    };
  }

  if (inbound.type === "hysteria2") {
    return {
      ...baseFields,
      type: "hysteria2",
      tls_enabled: inbound.tls?.enabled ?? false,
      up_mbps: inbound.up_mbps ?? 0,
      down_mbps: inbound.down_mbps ?? 0,
      users: inbound.users?.map((user) => ({
        name: user.name ?? "",
        password: user.password ?? "",
      })) ?? [{ name: "", password: "" }],
      tls_server_name: inbound.tls?.server_name ?? "",
      certificate_path:
        inbound.tls?.certificate_path?.replace(
          clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR,
          "",
        ) ?? "",
      key_path:
        inbound.tls?.key_path?.replace(
          clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR,
          "",
        ) ?? "",
      _tlsChecked: false,
      _tlsOverwrite: false,
    };
  }

  throw new Error(`Unsupported inbound type: ${inbound.type}`);
}
