import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type DraftInbound } from "@/shared/api/contracts";
import { clientEnv } from "@/shared/lib";

export function mapHy2FormToInbound(
  values: Extract<InboundFormValues, { type: "hysteria2" }>,
): DraftInbound {
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
      _is_selfsigned_cert: values._is_selfsigned_cert,
    },
  };
}
