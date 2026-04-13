import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type SaveHysteria2Inbound } from "@/shared/api/contracts";

function mapMasquerade(
  masquerade: Extract<InboundFormValues, { type: "hysteria2" }>["masquerade"],
): SaveHysteria2Inbound["masquerade"] {
  if (masquerade.type === "disabled") {
    return undefined;
  }

  if (masquerade.type === "url") {
    return masquerade.url_string?.trim() || undefined;
  }

  if (masquerade.type === "file_server") {
    const directory = masquerade.directory?.trim();

    if (!directory) {
      return undefined;
    }

    return {
      type: "file",
      directory,
    };
  }

  if (masquerade.type === "reverse_proxy") {
    const url = masquerade.url?.trim();

    if (!url) {
      return undefined;
    }

    return {
      type: "proxy",
      url,
    };
  }

  return {
    type: "string",
  };
}

export function mapHy2FormToInbound(
  values: Extract<InboundFormValues, { type: "hysteria2" }>,
): SaveHysteria2Inbound {
  return {
    type: "hysteria2",
    display_tag: values.display_tag,
    listen: values.listen,
    listen_port: values.listen_port,
    sniff: values.sniff,
    up_mbps: values.ignore_client_bandwidth ? undefined : values.up_mbps,
    down_mbps: values.ignore_client_bandwidth ? undefined : values.down_mbps,
    ignore_client_bandwidth: values.ignore_client_bandwidth,
    users: values.users.map((user) => ({
      display_name: user.display_name,
      password: user.password,
    })),
    _security_asset_id: values._security_asset_id,
    obfs: values.obfs_enabled
      ? {
          type: "salamander",
          password: values.obfs_password?.trim() || undefined,
        }
      : undefined,
    bbr_profile: values.bbr_profile,
    brutal_debug: values.brutal_debug,
    masquerade: mapMasquerade(values.masquerade),
  };
}
