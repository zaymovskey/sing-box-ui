import { getDb } from "@/server/db/client";

const sql = String.raw;

export function deleteSecurityAssetById(id: string): boolean {
  const db = getDb();

  const result = db
    .prepare(
      sql`
        DELETE FROM security_assets
        WHERE id = ?
      `,
    )
    .run(id);

  return result.changes > 0;
}
