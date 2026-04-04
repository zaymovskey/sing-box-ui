import { getDb } from "@/server/db/client";
import {
  type SecurityAsset,
  type SecurityAssetType,
} from "@/shared/api/contracts";

const sql = String.raw;

type SecurityAssetRow = {
  id: string;
  name: string;
  kind: SecurityAssetType;
  server_name: string | null;
  created_at: string;
  updated_at: string;
};

type SecurityAssetTlsRow = {
  asset_id: string;
  source_type: "inline" | "file";
  certificate_pem: string | null;
  key_pem: string | null;
  certificate_path: string | null;
  key_path: string | null;
  is_selfsigned_cert: number;
};

type SecurityAssetRealityRow = {
  asset_id: string;
  private_key: string;
  short_id: string;
  fingerprint: string;
  spider_x: string | null;
  handshake_server: string;
  handshake_server_port: number;
  max_time_difference: string | null;
  public_key: string;
};

function mapSecurityAssetRowToDomain(
  row: SecurityAssetRow,
  tlsRow?: SecurityAssetTlsRow,
  realityRow?: SecurityAssetRealityRow,
): SecurityAsset {
  if (row.kind === "tls") {
    if (!tlsRow) {
      throw new Error(`TLS details not found for asset ${row.id}`);
    }

    if (tlsRow.source_type === "inline") {
      return {
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        type: "tls",
        serverName: row.server_name ?? "",
        source: {
          sourceType: "inline",
          certificatePem: tlsRow.certificate_pem ?? "",
          keyPem: tlsRow.key_pem ?? "",
          _is_selfsigned_cert: Boolean(tlsRow.is_selfsigned_cert),
        },
      };
    }

    return {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      type: "tls",
      serverName: row.server_name ?? "",
      source: {
        sourceType: "file",
        certificatePath: tlsRow.certificate_path ?? "",
        keyPath: tlsRow.key_path ?? "",
        _is_selfsigned_cert: Boolean(tlsRow.is_selfsigned_cert),
      },
    };
  }

  if (!realityRow) {
    throw new Error(`Reality details not found for asset ${row.id}`);
  }

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    type: "reality",
    serverName: row.server_name ?? "",
    privateKey: realityRow.private_key,
    shortId: realityRow.short_id,
    fingerprint: realityRow.fingerprint,
    spiderX: realityRow.spider_x ?? "/",
    handshake: {
      server: realityRow.handshake_server,
      serverPort: realityRow.handshake_server_port,
    },
    maxTimeDifference: realityRow.max_time_difference ?? undefined,
    _publicKey: realityRow.public_key,
  };
}

function insertSecurityAssetDetails(
  db: ReturnType<typeof getDb>,
  asset: SecurityAsset,
) {
  if (asset.type === "tls") {
    if (asset.source.sourceType === "inline") {
      db.prepare(
        sql`
          INSERT INTO security_asset_tls (
            asset_id,
            source_type,
            certificate_pem,
            key_pem,
            certificate_path,
            key_path,
            is_selfsigned_cert
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      ).run(
        asset.id,
        "inline",
        asset.source.certificatePem,
        asset.source.keyPem,
        null,
        null,
        asset.source._is_selfsigned_cert ? 1 : 0,
      );

      return;
    }

    db.prepare(
      sql`
        INSERT INTO security_asset_tls (
          asset_id,
          source_type,
          certificate_pem,
          key_pem,
          certificate_path,
          key_path,
          is_selfsigned_cert
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      asset.id,
      "file",
      null,
      null,
      asset.source.certificatePath,
      asset.source.keyPath,
      asset.source._is_selfsigned_cert ? 1 : 0,
    );

    return;
  }

  db.prepare(
    sql`
      INSERT INTO security_asset_reality (
        asset_id,
        private_key,
        short_id,
        fingerprint,
        spider_x,
        handshake_server,
        handshake_server_port,
        max_time_difference,
        public_key
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    asset.id,
    asset.privateKey,
    asset.shortId,
    asset.fingerprint,
    asset.spiderX ?? null,
    asset.handshake.server,
    asset.handshake.serverPort,
    asset.maxTimeDifference ?? null,
    asset._publicKey,
  );
}

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

export function getSecurityAssets(type?: SecurityAssetType): SecurityAsset[] {
  const db = getDb();

  const assetRows = type
    ? (db
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
            WHERE kind = ?
            ORDER BY created_at DESC
          `,
        )
        .all(type) as SecurityAssetRow[])
    : (db
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
            ORDER BY created_at DESC
          `,
        )
        .all() as SecurityAssetRow[]);

  return assetRows.map((row) => {
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
  });
}

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
