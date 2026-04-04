import { randomUUID } from "node:crypto";

import { getDb } from "@/server/db/client";
import { getSecurityAssets } from "@/server/db/security-assets/repository";
import {
  type DraftHysteria2Inbound,
  type DraftInbound,
  type DraftVlessInbound,
  InboundHysteria2RowSchema,
  InboundRowSchema,
  InboundUserRowSchema,
  InboundVlessRowSchema,
  type SecurityAsset,
} from "@/shared/api/contracts";

const sql = String.raw;

function sqliteBoolToBoolean(value: 0 | 1 | null): boolean | undefined {
  if (value === null) {
    return undefined;
  }

  return value === 1;
}

function mapMasqueradeFromRow(row: {
  masquerade_string: string | null;
  masquerade_type: string | null;
  masquerade_file: string | null;
  masquerade_directory: string | null;
  masquerade_url: string | null;
}): DraftHysteria2Inbound["masquerade"] | undefined {
  if (row.masquerade_string) {
    return row.masquerade_string;
  }

  const hasObjectFields =
    row.masquerade_type ||
    row.masquerade_file ||
    row.masquerade_directory ||
    row.masquerade_url;

  if (!hasObjectFields) {
    return undefined;
  }

  return {
    type: row.masquerade_type ?? undefined,
    file: row.masquerade_file ?? undefined,
    directory: row.masquerade_directory ?? undefined,
    url: row.masquerade_url ?? undefined,
  };
}

function mapTlsFromSecurityAssetForVless(
  asset: SecurityAsset | undefined,
  tlsEnabled: boolean | undefined,
  realityPublicKey: string | null,
): DraftVlessInbound["tls"] | undefined {
  if (!tlsEnabled) {
    return undefined;
  }

  if (!asset || asset.type !== "reality") {
    return {
      enabled: true,
      reality: {
        _reality_public_key: realityPublicKey ?? undefined,
      },
    };
  }

  return {
    enabled: true,
    server_name: asset.serverName,
    reality: {
      enabled: true,
      handshake: {
        server: asset.handshake.server,
        server_port: asset.handshake.serverPort,
      },
      private_key: asset.privateKey,
      short_id: asset.shortId,
      max_time_difference: asset.maxTimeDifference ?? undefined,
      _reality_public_key: realityPublicKey ?? asset._publicKey ?? undefined,
    },
  };
}

function mapTlsFromSecurityAssetForHy2(
  asset: SecurityAsset | undefined,
): DraftHysteria2Inbound["tls"] | undefined {
  if (!asset || asset.type !== "tls") {
    return undefined;
  }

  if (asset.source.sourceType === "inline") {
    return {
      enabled: true,
      server_name: asset.serverName,
      certificate: asset.source.certificatePem,
      key: asset.source.keyPem,
    };
  }

  return {
    enabled: true,
    server_name: asset.serverName,
    certificate_path: asset.source.certificatePath,
    key_path: asset.source.keyPath,
  };
}

export function getDraftInbounds(): DraftInbound[] {
  const db = getDb();

  const inboundRows = db
    .prepare(
      sql`
        SELECT
          id,
          tag,
          type,
          listen,
          listen_port,
          sniff,
          sniff_override_destination,
          security_asset_id,
          created_at,
          updated_at
        FROM inbounds
        ORDER BY created_at DESC
      `,
    )
    .all()
    .map((row) => InboundRowSchema.parse(row));

  const vlessRows = db
    .prepare(
      sql`
        SELECT
          inbound_id,
          tls_enabled,
          reality_public_key
        FROM inbound_vless
      `,
    )
    .all()
    .map((row) => InboundVlessRowSchema.parse(row));

  const hysteria2Rows = db
    .prepare(
      sql`
        SELECT
          inbound_id,
          up_mbps,
          down_mbps,
          ignore_client_bandwidth,
          obfs_type,
          obfs_password,
          masquerade_string,
          masquerade_type,
          masquerade_file,
          masquerade_directory,
          masquerade_url,
          bbr_profile,
          brutal_debug
        FROM inbound_hysteria2
      `,
    )
    .all()
    .map((row) => InboundHysteria2RowSchema.parse(row));

  const userRows = db
    .prepare(
      sql`
        SELECT
          id,
          inbound_id,
          kind,
          sort_order,
          name,
          uuid,
          flow,
          password
        FROM inbound_users
        ORDER BY sort_order ASC
      `,
    )
    .all()
    .map((row) => InboundUserRowSchema.parse(row));

  const securityAssets = getSecurityAssets();
  const securityAssetById = new Map<string, SecurityAsset>(
    securityAssets.map((asset) => [asset.id, asset]),
  );

  const vlessByInboundId = new Map(
    vlessRows.map((row) => [row.inbound_id, row]),
  );
  const hysteria2ByInboundId = new Map(
    hysteria2Rows.map((row) => [row.inbound_id, row]),
  );

  const usersByInboundId = new Map<string, typeof userRows>();

  for (const user of userRows) {
    const current = usersByInboundId.get(user.inbound_id) ?? [];
    current.push(user);
    usersByInboundId.set(user.inbound_id, current);
  }

  return inboundRows.map((row) => {
    const linkedAsset = row.security_asset_id
      ? securityAssetById.get(row.security_asset_id)
      : undefined;

    if (row.type === "vless") {
      const vlessRow = vlessByInboundId.get(row.id);

      const vlessUsers: DraftVlessInbound["users"] = (
        usersByInboundId.get(row.id) ?? []
      ).map((user) => ({
        name: user.name ?? undefined,
        uuid: user.uuid ?? "",
        flow: user.flow === "xtls-rprx-vision" ? "xtls-rprx-vision" : undefined,
      }));

      const inbound: DraftVlessInbound = {
        type: "vless",
        tag: row.tag ?? undefined,
        listen: row.listen ?? undefined,
        listen_port: row.listen_port ?? undefined,
        sniff: sqliteBoolToBoolean(row.sniff),
        sniff_override_destination: sqliteBoolToBoolean(
          row.sniff_override_destination,
        ),
        users: vlessUsers,
        tls: mapTlsFromSecurityAssetForVless(
          linkedAsset,
          sqliteBoolToBoolean(vlessRow?.tls_enabled ?? null),
          vlessRow?.reality_public_key ?? null,
        ),
        _security_asset_id: row.security_asset_id ?? undefined,
        _tls_enabled: sqliteBoolToBoolean(vlessRow?.tls_enabled ?? null),
      };

      return inbound;
    }

    const hysteria2Row = hysteria2ByInboundId.get(row.id);

    const hysteria2Users: DraftHysteria2Inbound["users"] = (
      usersByInboundId.get(row.id) ?? []
    ).map((user) => ({
      name: user.name ?? undefined,
      password: user.password ?? "",
    }));

    const inbound: DraftHysteria2Inbound = {
      type: "hysteria2",
      tag: row.tag ?? undefined,
      listen: row.listen ?? undefined,
      listen_port: row.listen_port ?? undefined,
      sniff: sqliteBoolToBoolean(row.sniff),
      sniff_override_destination: sqliteBoolToBoolean(
        row.sniff_override_destination,
      ),
      up_mbps: hysteria2Row?.up_mbps ?? undefined,
      down_mbps: hysteria2Row?.down_mbps ?? undefined,
      ignore_client_bandwidth: sqliteBoolToBoolean(
        hysteria2Row?.ignore_client_bandwidth ?? null,
      ),
      users: hysteria2Users,
      obfs:
        hysteria2Row?.obfs_type || hysteria2Row?.obfs_password
          ? {
              type:
                hysteria2Row?.obfs_type === "salamander"
                  ? "salamander"
                  : undefined,
              password: hysteria2Row?.obfs_password ?? undefined,
            }
          : undefined,
      tls: mapTlsFromSecurityAssetForHy2(linkedAsset),
      masquerade: hysteria2Row ? mapMasqueradeFromRow(hysteria2Row) : undefined,
      bbr_profile: hysteria2Row?.bbr_profile ?? undefined,
      brutal_debug: sqliteBoolToBoolean(hysteria2Row?.brutal_debug ?? null),
      _security_asset_id: row.security_asset_id ?? undefined,
    };

    return inbound;
  });
}

function booleanToSqliteBool(value: boolean | undefined): 0 | 1 | null {
  if (value === undefined) {
    return null;
  }

  return value ? 1 : 0;
}

function mapMasqueradeToRow(masquerade: DraftHysteria2Inbound["masquerade"]): {
  masquerade_string: string | null;
  masquerade_type: string | null;
  masquerade_file: string | null;
  masquerade_directory: string | null;
  masquerade_url: string | null;
} {
  if (!masquerade) {
    return {
      masquerade_string: null,
      masquerade_type: null,
      masquerade_file: null,
      masquerade_directory: null,
      masquerade_url: null,
    };
  }

  if (typeof masquerade === "string") {
    return {
      masquerade_string: masquerade,
      masquerade_type: null,
      masquerade_file: null,
      masquerade_directory: null,
      masquerade_url: null,
    };
  }

  return {
    masquerade_string: null,
    masquerade_type: masquerade.type ?? null,
    masquerade_file: masquerade.file ?? null,
    masquerade_directory: masquerade.directory ?? null,
    masquerade_url: masquerade.url ?? null,
  };
}

export function createDraftInbound(input: DraftInbound): { ok: true } {
  const db = getDb();
  const now = new Date().toISOString();
  const inboundId = randomUUID();

  const trx = db.transaction((draft: DraftInbound) => {
    db.prepare(
      sql`
        INSERT INTO inbounds (
          id,
          tag,
          type,
          listen,
          listen_port,
          sniff,
          sniff_override_destination,
          security_asset_id,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      inboundId,
      draft.tag ?? null,
      draft.type,
      draft.listen ?? null,
      draft.listen_port ?? null,
      booleanToSqliteBool(draft.sniff),
      booleanToSqliteBool(draft.sniff_override_destination),
      draft._security_asset_id ?? null,
      now,
      now,
    );

    if (draft.type === "vless") {
      const vlessDraft: DraftVlessInbound = draft;

      db.prepare(
        sql`
          INSERT INTO inbound_vless (
            inbound_id,
            tls_enabled,
            reality_public_key
          )
          VALUES (?, ?, ?)
        `,
      ).run(
        inboundId,
        booleanToSqliteBool(vlessDraft._tls_enabled),
        vlessDraft.tls?.reality?._reality_public_key ?? null,
      );

      vlessDraft.users.forEach((user, index) => {
        db.prepare(
          sql`
            INSERT INTO inbound_users (
              id,
              inbound_id,
              kind,
              sort_order,
              name,
              uuid,
              flow,
              password
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
        ).run(
          randomUUID(),
          inboundId,
          "vless",
          index,
          user.name ?? null,
          user.uuid,
          user.flow ?? null,
          null,
        );
      });

      return { ok: true } as const;
    }

    const hysteria2Draft: DraftHysteria2Inbound = draft;
    const masqueradeRow = mapMasqueradeToRow(hysteria2Draft.masquerade);

    db.prepare(
      sql`
        INSERT INTO inbound_hysteria2 (
          inbound_id,
          up_mbps,
          down_mbps,
          ignore_client_bandwidth,
          obfs_type,
          obfs_password,
          masquerade_string,
          masquerade_type,
          masquerade_file,
          masquerade_directory,
          masquerade_url,
          bbr_profile,
          brutal_debug
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      inboundId,
      hysteria2Draft.up_mbps ?? null,
      hysteria2Draft.down_mbps ?? null,
      booleanToSqliteBool(hysteria2Draft.ignore_client_bandwidth),
      hysteria2Draft.obfs?.type ?? null,
      hysteria2Draft.obfs?.password ?? null,
      masqueradeRow.masquerade_string,
      masqueradeRow.masquerade_type,
      masqueradeRow.masquerade_file,
      masqueradeRow.masquerade_directory,
      masqueradeRow.masquerade_url,
      hysteria2Draft.bbr_profile ?? null,
      booleanToSqliteBool(hysteria2Draft.brutal_debug),
    );

    hysteria2Draft.users.forEach((user, index) => {
      db.prepare(
        sql`
          INSERT INTO inbound_users (
            id,
            inbound_id,
            kind,
            sort_order,
            name,
            uuid,
            flow,
            password
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).run(
        randomUUID(),
        inboundId,
        "hysteria2",
        index,
        user.name ?? null,
        null,
        null,
        user.password,
      );
    });

    return { ok: true } as const;
  });

  return trx(input);
}

export function deleteDraftInboundByTag(tag: string): boolean {
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

export function updateDraftInboundByTag(
  tag: string,
  input: DraftInbound,
): boolean {
  const db = getDb();
  const now = new Date().toISOString();

  const trx = db.transaction((currentTag: string, draft: DraftInbound) => {
    const existing = db
      .prepare(
        sql`
          SELECT id
          FROM inbounds
          WHERE tag = ?
        `,
      )
      .get(currentTag) as { id: string } | undefined;

    if (!existing) {
      return false;
    }

    const inboundId = existing.id;

    db.prepare(
      sql`
        UPDATE inbounds
        SET
          tag = ?,
          type = ?,
          listen = ?,
          listen_port = ?,
          sniff = ?,
          sniff_override_destination = ?,
          security_asset_id = ?,
          updated_at = ?
        WHERE id = ?
      `,
    ).run(
      draft.tag ?? null,
      draft.type,
      draft.listen ?? null,
      draft.listen_port ?? null,
      booleanToSqliteBool(draft.sniff),
      booleanToSqliteBool(draft.sniff_override_destination),
      draft._security_asset_id ?? null,
      now,
      inboundId,
    );

    db.prepare(
      sql`
        DELETE FROM inbound_vless
        WHERE inbound_id = ?
      `,
    ).run(inboundId);

    db.prepare(
      sql`
        DELETE FROM inbound_hysteria2
        WHERE inbound_id = ?
      `,
    ).run(inboundId);

    db.prepare(
      sql`
        DELETE FROM inbound_users
        WHERE inbound_id = ?
      `,
    ).run(inboundId);

    if (draft.type === "vless") {
      const vlessDraft: DraftVlessInbound = draft;

      db.prepare(
        sql`
          INSERT INTO inbound_vless (
            inbound_id,
            tls_enabled,
            reality_public_key
          )
          VALUES (?, ?, ?)
        `,
      ).run(
        inboundId,
        booleanToSqliteBool(vlessDraft._tls_enabled),
        vlessDraft.tls?.reality?._reality_public_key ?? null,
      );

      vlessDraft.users.forEach((user, index) => {
        db.prepare(
          sql`
            INSERT INTO inbound_users (
              id,
              inbound_id,
              kind,
              sort_order,
              name,
              uuid,
              flow,
              password
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
        ).run(
          randomUUID(),
          inboundId,
          "vless",
          index,
          user.name ?? null,
          user.uuid,
          user.flow ?? null,
          null,
        );
      });

      return true;
    }

    const hysteria2Draft: DraftHysteria2Inbound = draft;
    const masqueradeRow = mapMasqueradeToRow(hysteria2Draft.masquerade);

    db.prepare(
      sql`
        INSERT INTO inbound_hysteria2 (
          inbound_id,
          up_mbps,
          down_mbps,
          ignore_client_bandwidth,
          obfs_type,
          obfs_password,
          masquerade_string,
          masquerade_type,
          masquerade_file,
          masquerade_directory,
          masquerade_url,
          bbr_profile,
          brutal_debug
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      inboundId,
      hysteria2Draft.up_mbps ?? null,
      hysteria2Draft.down_mbps ?? null,
      booleanToSqliteBool(hysteria2Draft.ignore_client_bandwidth),
      hysteria2Draft.obfs?.type ?? null,
      hysteria2Draft.obfs?.password ?? null,
      masqueradeRow.masquerade_string,
      masqueradeRow.masquerade_type,
      masqueradeRow.masquerade_file,
      masqueradeRow.masquerade_directory,
      masqueradeRow.masquerade_url,
      hysteria2Draft.bbr_profile ?? null,
      booleanToSqliteBool(hysteria2Draft.brutal_debug),
    );

    hysteria2Draft.users.forEach((user, index) => {
      db.prepare(
        sql`
          INSERT INTO inbound_users (
            id,
            inbound_id,
            kind,
            sort_order,
            name,
            uuid,
            flow,
            password
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      ).run(
        randomUUID(),
        inboundId,
        "hysteria2",
        index,
        user.name ?? null,
        null,
        null,
        user.password,
      );
    });

    return true;
  });

  return trx(tag, input);
}
