import { getDb } from "@/server/db/client";
import { type SecurityAsset } from "@/shared/api/contracts";

import { insertSecurityAssetDetails } from "../helpers";

const sql = String.raw;

export function updateSecurityAsset(asset: SecurityAsset): SecurityAsset {
  const db = getDb();

  const trx = db.transaction((input: SecurityAsset) => {
    const exists = db
      .prepare(
        sql`
          SELECT id
          FROM security_assets
          WHERE id = ?
        `,
      )
      .get(input.id) as { id: string } | undefined;

    if (!exists) {
      throw new Error("SECURITY_ASSET_NOT_FOUND");
    }

    db.prepare(
      sql`
        UPDATE security_assets
        SET
          name = ?,
          kind = ?,
          server_name = ?,
          updated_at = ?
        WHERE id = ?
      `,
    ).run(
      input.name,
      input.type,
      input.serverName ?? null,
      input.updatedAt,
      input.id,
    );

    db.prepare(
      sql`
        DELETE FROM security_asset_tls
        WHERE asset_id = ?
      `,
    ).run(input.id);

    db.prepare(
      sql`
        DELETE FROM security_asset_reality
        WHERE asset_id = ?
      `,
    ).run(input.id);

    insertSecurityAssetDetails(db, input);

    return input;
  });

  return trx(asset);
}
