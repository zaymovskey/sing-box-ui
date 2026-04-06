import { type getDb } from "@/server/db/client";
import { type SecurityAsset } from "@/shared/api/contracts";

import {
  type SecurityAssetRealityRow,
  type SecurityAssetRow,
  type SecurityAssetTlsRow,
} from "./repository/types";

const sql = String.raw;

export function insertSecurityAssetDetails(
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

export function mapSecurityAssetRowToDomain(
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
