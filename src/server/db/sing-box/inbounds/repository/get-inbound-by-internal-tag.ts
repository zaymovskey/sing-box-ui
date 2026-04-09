import { getDb } from "@/server/db/client";
import { type InboundRow, InboundRowSchema } from "@/shared/api/contracts";

export function getStoredInboundByInternalTag(
  internalTag: string,
): InboundRow | null {
  const db = getDb();

  const rowInbound = db
    .prepare("SELECT * FROM inbounds WHERE internal_tag = ?")
    .get(internalTag);

  if (!rowInbound) {
    return null;
  }

  const parsedInbound = InboundRowSchema.parse(rowInbound);

  return parsedInbound;
}
