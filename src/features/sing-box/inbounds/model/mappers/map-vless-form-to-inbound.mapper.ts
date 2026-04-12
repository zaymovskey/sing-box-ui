import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type SaveVlessInbound } from "@/shared/api/contracts";

function parseHeaders(
  value: string | undefined,
): Record<string, string> | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  return JSON.parse(value) as Record<string, string>;
}

function mapTransport(
  transport: Extract<InboundFormValues, { type: "vless" }>["transport"],
): SaveVlessInbound["transport"] {
  if (!transport || transport.type === "disabled") {
    return undefined;
  }

  if (transport.type === "ws") {
    return {
      type: "ws",
      path: transport.path || undefined,
      headers: parseHeaders(transport.headers),
      max_early_data: transport.max_early_data,
      early_data_header_name: transport.early_data_header_name || undefined,
    };
  }

  if (transport.type === "grpc") {
    return {
      type: "grpc",
      service_name: transport.service_name,
      idle_timeout: transport.idle_timeout || undefined,
      ping_timeout: transport.ping_timeout || undefined,
      permit_without_stream: transport.permit_without_stream,
    };
  }

  if (transport.type === "http") {
    return {
      type: "http",
      host: transport.host
        ? transport.host
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      path: transport.path || undefined,
      method: transport.method || undefined,
      headers: parseHeaders(transport.headers),
      idle_timeout: transport.idle_timeout || undefined,
      ping_timeout: transport.ping_timeout || undefined,
    };
  }

  if (transport.type === "httpupgrade") {
    return {
      type: "httpupgrade",
      host: transport.host || undefined,
      path: transport.path || undefined,
      headers: parseHeaders(transport.headers),
    };
  }

  return {
    type: "quic",
  };
}

export function mapVlessFormToInbound(
  values: Extract<InboundFormValues, { type: "vless" }>,
): SaveVlessInbound {
  return {
    type: "vless",
    display_tag: values.display_tag,
    listen: values.listen,
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    users: values.users.map((user) => ({
      display_name: user.display_name,
      uuid: user.uuid,
      flow: user.flow,
    })),
    multiplex: {
      enabled: values.multiplex?.enabled ?? false,
      padding: values.multiplex?.padding ?? false,
      brutal: {
        enabled: values.multiplex?.brutal?.enabled ?? false,
        up_mbps: values.multiplex?.brutal?.up_mbps ?? 0,
        down_mbps: values.multiplex?.brutal?.down_mbps ?? 0,
      },
    },
    _tls_enabled: values._tls_enabled,
    _security_asset_id: values._security_asset_id,
    transport: mapTransport(values.transport),
  };
}
