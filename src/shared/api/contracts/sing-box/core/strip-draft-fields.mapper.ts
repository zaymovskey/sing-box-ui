import { type RuntimeConfig } from "./runtime-config.schema";

export function stripDraftFields(
  config: Record<string, unknown>,
): RuntimeConfig {
  const inbounds = Array.isArray(config.inbounds)
    ? config.inbounds.map((inbound) => {
        if (!inbound || typeof inbound !== "object") {
          return inbound;
        }

        return inbound;
      })
    : undefined;

  return {
    ...config,
    inbounds,
  } as RuntimeConfig;
}
