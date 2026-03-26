import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type DraftConfig } from "@/shared/api/contracts";

export function applyRealityPublicKey(
  config: DraftConfig,
  values: Extract<InboundFormValues, { type: "vless" }>,
): DraftConfig {
  if (!values.reality_enabled) {
    return config;
  }

  if (!values.reality_private_key || !values._reality_public_key) {
    return config;
  }

  const inbounds = config.inbounds ?? [];

  return {
    ...config,
    inbounds: inbounds.map((inbound) => {
      if (inbound.type !== "vless") return inbound;

      if (!inbound.tls?.reality) return inbound;

      if (inbound.tls.reality.private_key !== values.reality_private_key) {
        return inbound;
      }

      return {
        ...inbound,
        tls: {
          ...inbound.tls,
          reality: {
            ...inbound.tls.reality,
            _reality_public_key: values._reality_public_key,
          },
        },
      };
    }),
  };
}
