import { type DraftConfig } from "./draft-config.schema";
import { type RuntimeConfig } from "./runtime-config.schema";

export function stripDraftFields(config: DraftConfig): RuntimeConfig {
  return {
    ...config,
    inbounds: config.inbounds?.map((inbound) => {
      if (inbound.type === "vless") {
        return {
          ...inbound,
          tls: inbound.tls
            ? {
                ...inbound.tls,
                reality: inbound.tls.reality
                  ? {
                      ...inbound.tls.reality,
                      _reality_public_key: undefined,
                    }
                  : inbound.tls.reality,
              }
            : inbound.tls,
        };
      }

      if (inbound.type === "hysteria2") {
        return {
          ...inbound,
          tls: inbound.tls
            ? {
                ...inbound.tls,
                _is_selfsigned_cert: undefined,
              }
            : inbound.tls,
        };
      }

      return inbound;
    }),
  };
}
