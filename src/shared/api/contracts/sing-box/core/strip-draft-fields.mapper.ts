import { type RuntimeConfig } from "./runtime-config.schema";

export function stripDraftFields(
  config: Record<string, unknown>,
): RuntimeConfig {
  const inbounds = Array.isArray(config.inbounds)
    ? config.inbounds.map((inbound) => {
        if (!inbound || typeof inbound !== "object") {
          return inbound;
        }

        const typedInbound = inbound as Record<string, unknown>;

        if (typedInbound.type === "vless") {
          const tls =
            typedInbound.tls && typeof typedInbound.tls === "object"
              ? (typedInbound.tls as Record<string, unknown>)
              : undefined;

          const reality =
            tls?.reality && typeof tls.reality === "object"
              ? (tls.reality as Record<string, unknown>)
              : undefined;

          const nextReality = reality
            ? (() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _reality_public_key, ...restReality } = reality;
                return restReality;
              })()
            : reality;

          const nextTls = tls
            ? {
                ...tls,
                reality: nextReality,
              }
            : tls;

          return {
            ...typedInbound,
            tls: nextTls,
          };
        }

        if (typedInbound.type === "hysteria2") {
          const tls =
            typedInbound.tls && typeof typedInbound.tls === "object"
              ? (typedInbound.tls as Record<string, unknown>)
              : undefined;

          const nextTls = tls
            ? (() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _is_selfsigned_cert, ...restTls } = tls;
                return restTls;
              })()
            : tls;

          return {
            ...typedInbound,
            tls: nextTls,
          };
        }

        return typedInbound;
      })
    : undefined;

  return {
    ...config,
    inbounds,
  } as RuntimeConfig;
}
