import { type Configuration } from "@black-duty/sing-box-schema";
import { type z } from "zod";

import { type CreateInboundFormValues } from "../../config-core/model/config-core.inbounds-schema";

type Config = z.infer<typeof Configuration>;
type Inbound = NonNullable<Config["inbounds"]>[number];

function mapVlessFormToInbound(
  values: Extract<CreateInboundFormValues, { type: "vless" }>,
): Inbound {
  return {
    type: "vless",
    tag: values.tag,
    listen: "::",
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    users: [
      {
        name: values.user_name ?? "user",
        uuid: values.uuid,
        flow: values.flow || undefined,
      },
    ],
    tls: {
      enabled: true,
      server_name: values.tls_server_name ?? "www.cloudflare.com",
      reality: {
        enabled: true,
        handshake: {
          server: values.reality_handshake_server ?? "www.cloudflare.com",
          server_port: values.reality_handshake_port,
        },
        private_key: values.reality_private_key,
      },
    },
  };
}

function mapHy2FormToInbound(
  values: Extract<CreateInboundFormValues, { type: "hysteria2" }>,
): Inbound {
  return {
    type: "hysteria2",
    tag: values.tag,
    listen: "::",
    listen_port: values.listen_port,
    sniff: values.sniff,
    sniff_override_destination: values.sniff_override_destination,
    up_mbps: values.up_mbps,
    down_mbps: values.down_mbps,
    users: [
      {
        name: values.user_name,
        password: values.password,
      },
    ],
    tls: {
      enabled: true,
      server_name: values.tls_server_name ?? "www.cloudflare.com",
      certificate_path: values.certificate_path,
      key_path: values.key_path,
    },
  };
}

export function mapFormToInbound(values: CreateInboundFormValues): Inbound {
  if (values.type === "vless") {
    return mapVlessFormToInbound(values);
  }

  return mapHy2FormToInbound(values);
}
