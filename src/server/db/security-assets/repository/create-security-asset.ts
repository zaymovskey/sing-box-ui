import { getDb } from "@/server/db/client";
import { type SecurityAsset } from "@/shared/api/contracts";

const sql = String.raw;
import { insertSecurityAssetDetails } from "../helpers";

export function createSecurityAsset(asset: SecurityAsset) {
  const db = getDb();

  const trx = db.transaction((input: SecurityAsset) => {
    db.prepare(
      sql`
        INSERT INTO security_assets (
          id,
          name,
          kind,
          server_name,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
    ).run(
      input.id,
      input.name,
      input.type,
      input.serverName ?? null,
      input.createdAt,
      input.updatedAt,
    );

    insertSecurityAssetDetails(db, input);

    return input;
  });

  return trx(asset);
}
