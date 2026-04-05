import { getDb } from "@/server/db/client";
import { type SecurityAsset } from "@/shared/api/contracts";

import { mapSecurityAssetRowToDomain } from "../helpers";
import {
  type SecurityAssetRealityRow,
  type SecurityAssetRow,
  type SecurityAssetTlsRow,
} from "./types";

const sql = String.raw;

export function getSecurityAssetById(id: string): SecurityAsset | null {
  const db = getDb();

  const row = db
    .prepare(
      sql`
        SELECT
          id,
          name,
          kind,
          server_name,
          created_at,
          updated_at
        FROM security_assets
        WHERE id = ?
      `,
    )
    .get(id) as SecurityAssetRow | undefined;

  if (!row) {
    return null;
  }

  if (row.kind === "tls") {
    const tlsRow = db
      .prepare(
        sql`
          SELECT
            asset_id,
            source_type,
            certificate_pem,
            key_pem,
            certificate_path,
            key_path,
            is_selfsigned_cert
          FROM security_asset_tls
          WHERE asset_id = ?
        `,
      )
      .get(row.id) as SecurityAssetTlsRow | undefined;

    return mapSecurityAssetRowToDomain(row, tlsRow);
  }

  const realityRow = db
    .prepare(
      sql`
        SELECT
          asset_id,
          private_key,
          short_id,
          fingerprint,
          spider_x,
          handshake_server,
          handshake_server_port,
          max_time_difference,
          public_key
        FROM security_asset_reality
        WHERE asset_id = ?
      `,
    )
    .get(row.id) as SecurityAssetRealityRow | undefined;

  return mapSecurityAssetRowToDomain(row, undefined, realityRow);
}
