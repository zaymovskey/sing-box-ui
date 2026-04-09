import { getDb } from "@/server/db/client";

const sql = String.raw;

export function deleteStoredInboundByInternalTag(internalTag: string): boolean {
  const db = getDb();

  const result = db
    .prepare(
      sql`
        DELETE FROM inbounds
        WHERE internal_tag = ?
      `,
    )
    .run(internalTag);

  return result.changes > 0;
}
