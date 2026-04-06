import { type StoredInbound } from "@/shared/api/contracts";

type IsUniqueInboundBindParams = {
  listen: string;
  listenPort: number;
  inbounds: StoredInbound[];
  excludeTag?: string;
};

const normalizeListen = (listen: string | undefined) => {
  let normalized = listen?.trim().toLowerCase();

  if (["::", "0.0.0.0", "", undefined].includes(normalized ?? "")) {
    normalized = "::";
  }

  return normalized;
};

export function isUniqueInboundBind({
  listen,
  listenPort,
  inbounds,
  excludeTag,
}: IsUniqueInboundBindParams): boolean {
  const normalizedListen = normalizeListen(listen);

  return !inbounds.some((inbound) => {
    if (excludeTag && inbound.display_tag === excludeTag) {
      return false;
    }

    const normalizedInboundListen = normalizeListen(inbound.listen);

    return (
      normalizedInboundListen === normalizedListen &&
      inbound.listen_port === listenPort
    );
  });
}
