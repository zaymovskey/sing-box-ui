import {
  type Inbound,
  type InboundFormValues,
} from "@/features/sing-box/config-core";
import { clientEnv } from "@/shared/lib";

function mapVlessFormToInbound(
  values: Extract<InboundFormValues, { type: "vless" }>,
): Inbound {
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
    tls: {
      enabled: values.tls_enabled,
      server_name: values.tls_server_name,
      reality: {
        enabled: values.reality_enabled,
        handshake: {
          server: values.reality_handshake_server ?? "",
          server_port: values.reality_handshake_server_port,
        },
        private_key: values.reality_private_key,
      },
    },
  };
}

function mapHy2FormToInbound(
  values: Extract<InboundFormValues, { type: "hysteria2" }>,
): Inbound {
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
    tls: {
      enabled: true,
      server_name: values.tls_server_name,
      certificate_path:
        clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + values.certificate_path,
      key_path: clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + values.key_path,
    },
  };
}

export function mapFormToInbound(values: InboundFormValues): Inbound {
  if (values.type === "vless") {
    return mapVlessFormToInbound(values);
  }

  return mapHy2FormToInbound(values);
}

export function mapInboundToFormValues(inbound: Inbound): InboundFormValues {
  if (inbound.type === "vless") {
    return {
      type: "vless",
      tag: inbound.tag ?? "",
      listen: inbound.listen ?? "",
      reality_handshake_server_port:
        inbound.tls?.reality?.handshake?.server_port ?? 443,
      reality_enabled: inbound.tls?.reality?.enabled ?? false,
      listen_port: inbound.listen_port ?? 0,
      tls_enabled: inbound.tls?.enabled ?? false,

      sniff: inbound.sniff ?? false,
      sniff_override_destination: inbound.sniff_override_destination ?? false,

      users: inbound.users?.map((user) => ({
        name: user.name ?? "",
        uuid: user.uuid ?? "",
        flow: user.flow ?? "",
      })) ?? [{ name: "", uuid: "", flow: "" }],

      tls_server_name: inbound.tls?.server_name ?? "",
      reality_private_key: inbound.tls?.reality?.private_key ?? "",
      reality_handshake_server: inbound.tls?.reality?.handshake?.server ?? "",
    };
  }

  if (inbound.type === "hysteria2") {
    return {
      type: "hysteria2",
      listen: inbound.listen ?? "",
      tag: inbound.tag ?? "",
      listen_port: inbound.listen_port ?? 0,
      tls_enabled: inbound.tls?.enabled ?? false,

      sniff: inbound.sniff ?? false,
      sniff_override_destination: inbound.sniff_override_destination ?? false,

      up_mbps: inbound.up_mbps ?? 0,
      down_mbps: inbound.down_mbps ?? 0,

      users: inbound.users?.map((user) => ({
        name: user.name ?? "",
        password: user.password ?? "",
      })) ?? [{ name: "", password: "" }],

      tls_server_name: inbound.tls?.server_name ?? "",
      certificate_path: inbound.tls?.certificate_path ?? "",
      key_path: inbound.tls?.key_path ?? "",
    };
  }

  throw new Error(`Unsupported inbound type: ${inbound.type}`);
}
