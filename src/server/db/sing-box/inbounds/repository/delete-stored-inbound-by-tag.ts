import { getDb } from "@/server/db/client";

const sql = String.raw;

export function deleteStoredInboundByTag(tag: string): boolean {
  const db = getDb();

  const result = db
    .prepare(
      sql`
        DELETE FROM inbounds
        WHERE tag = ?
      `,
    )
    .run(tag);

  return result.changes > 0;
}
