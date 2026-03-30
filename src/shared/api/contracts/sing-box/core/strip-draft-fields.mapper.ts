import { type RuntimeConfig } from "./runtime-config.schema";

function omitDraftKeys(obj: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("_")),
  );
}

export function stripDraftFields(
  config: Record<string, unknown>,
): RuntimeConfig {
  const inbounds = Array.isArray(config.inbounds)
    ? config.inbounds.map((inbound) => {
        if (!inbound || typeof inbound !== "object") {
          return inbound;
        }

        return omitDraftKeys(inbound as Record<string, unknown>);
      })
    : undefined;

  return {
    ...config,
    inbounds,
  } as RuntimeConfig;
}
