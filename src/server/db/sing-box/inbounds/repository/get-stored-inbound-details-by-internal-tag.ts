import { type StoredInbound } from "@/shared/api/contracts";

import { getStoredInbounds } from "./get-stored-inbounds";

export function getStoredInboundDetailsByInternalTag(
  internalTag: string,
): StoredInbound | null {
  const inbound = getStoredInbounds().find(
    (item) => item.internal_tag === internalTag,
  );

  return inbound ?? null;
}
