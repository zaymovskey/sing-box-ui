import { randomUUID } from "node:crypto";

import { getDb } from "@/server/db/client";
import {
  type SaveInboundInput,
  type StoredHysteria2Inbound,
  type StoredInbound,
  type StoredVlessInbound,
} from "@/shared/api/contracts";

import {
  booleanToSqliteBool,
  ensureInternalNames,
  mapMasqueradeToRow,
} from "../../helpers";

const sql = String.raw;

type ExistingInboundUserRow = {
  id: string;
  internal_name: string;
};

function syncVlessUsers(
  db: ReturnType<typeof getDb>,
  inboundId: string,
  users: StoredVlessInbound["users"],
) {
  const existingRows = db
    .prepare(
      sql`
        SELECT
          id,
          internal_name
        FROM inbound_users
        WHERE inbound_id = ?
      `,
    )
    .all(inboundId) as ExistingInboundUserRow[];

  const existingByInternalName = new Map(
    existingRows.map((row) => [row.internal_name, row]),
  );

  const incomingInternalNames = new Set(
    users.map((user) => user.internal_name),
  );

  for (const [index, user] of users.entries()) {
    const existing = existingByInternalName.get(user.internal_name);

    if (existing) {
      db.prepare(
        sql`
          UPDATE inbound_users
          SET
            kind = ?,
            sort_order = ?,
            display_name = ?,
            uuid = ?,
            flow = ?,
            password = ?
          WHERE id = ?
        `,
      ).run(
        "vless",
        index,
        user.display_name,
        user.uuid,
        user.flow ?? null,
        null,
        existing.id,
      );

      continue;
    }

    db.prepare(
      sql`
        INSERT INTO inbound_users (
          id,
          inbound_id,
          kind,
          sort_order,
          internal_name,
          display_name,
          uuid,
          flow,
          password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      randomUUID(),
      inboundId,
      "vless",
      index,
      user.internal_name,
      user.display_name,
      user.uuid,
      user.flow ?? null,
      null,
    );
  }

  for (const existing of existingRows) {
    if (incomingInternalNames.has(existing.internal_name)) {
      continue;
    }

    db.prepare(
      sql`
        DELETE FROM inbound_users
        WHERE id = ?
      `,
    ).run(existing.id);
  }
}

function syncHysteria2Users(
  db: ReturnType<typeof getDb>,
  inboundId: string,
  users: StoredHysteria2Inbound["users"],
) {
  const existingRows = db
    .prepare(
      sql`
        SELECT
          id,
          internal_name
        FROM inbound_users
        WHERE inbound_id = ?
      `,
    )
    .all(inboundId) as ExistingInboundUserRow[];

  const existingByInternalName = new Map(
    existingRows.map((row) => [row.internal_name, row]),
  );

  const incomingInternalNames = new Set(
    users.map((user) => user.internal_name),
  );

  for (const [index, user] of users.entries()) {
    const existing = existingByInternalName.get(user.internal_name);

    if (existing) {
      db.prepare(
        sql`
          UPDATE inbound_users
          SET
            kind = ?,
            sort_order = ?,
            display_name = ?,
            uuid = ?,
            flow = ?,
            password = ?
          WHERE id = ?
        `,
      ).run(
        "hysteria2",
        index,
        user.display_name,
        null,
        null,
        user.password,
        existing.id,
      );

      continue;
    }

    db.prepare(
      sql`
        INSERT INTO inbound_users (
          id,
          inbound_id,
          kind,
          sort_order,
          internal_name,
          display_name,
          uuid,
          flow,
          password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      randomUUID(),
      inboundId,
      "hysteria2",
      index,
      user.internal_name,
      user.display_name,
      null,
      null,
      user.password,
    );
  }

  for (const existing of existingRows) {
    if (incomingInternalNames.has(existing.internal_name)) {
      continue;
    }

    db.prepare(
      sql`
        DELETE FROM inbound_users
        WHERE id = ?
      `,
    ).run(existing.id);
  }
}

export function updateStoredInboundByTag(
  tag: string,
  input: SaveInboundInput,
): boolean {
  const db = getDb();
  const now = new Date().toISOString();
  const stored = ensureInternalNames(input);

  const trx = db.transaction((currentTag: string, stored: StoredInbound) => {
    const existing = db
      .prepare(
        sql`
          SELECT id, type
          FROM inbounds
          WHERE tag = ?
        `,
      )
      .get(currentTag) as
      | { id: string; type: "vless" | "hysteria2" }
      | undefined;

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
      stored.tag ?? null,
      stored.type,
      stored.listen ?? null,
      stored.listen_port ?? null,
      booleanToSqliteBool(stored.sniff),
      booleanToSqliteBool(stored.sniff_override_destination),
      stored._security_asset_id ?? null,
      now,
      inboundId,
    );

    if (stored.type === "vless") {
      const vlessStored = stored as StoredVlessInbound;

      db.prepare(
        sql`
          DELETE FROM inbound_hysteria2
          WHERE inbound_id = ?
        `,
      ).run(inboundId);

      const existingVless = db
        .prepare(
          sql`
            SELECT inbound_id
            FROM inbound_vless
            WHERE inbound_id = ?
          `,
        )
        .get(inboundId) as { inbound_id: string } | undefined;

      if (existingVless) {
        db.prepare(
          sql`
            UPDATE inbound_vless
            SET
              tls_enabled = ?,
              reality_public_key = ?
            WHERE inbound_id = ?
          `,
        ).run(
          booleanToSqliteBool(vlessStored._tls_enabled),
          vlessStored.tls?.reality?._reality_public_key ?? null,
          inboundId,
        );
      } else {
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
          booleanToSqliteBool(vlessStored._tls_enabled),
          vlessStored.tls?.reality?._reality_public_key ?? null,
        );
      }

      syncVlessUsers(db, inboundId, vlessStored.users);

      return true;
    }

    const hysteria2Stored = stored as StoredHysteria2Inbound;
    const masqueradeRow = mapMasqueradeToRow(hysteria2Stored.masquerade);

    db.prepare(
      sql`
        DELETE FROM inbound_vless
        WHERE inbound_id = ?
      `,
    ).run(inboundId);

    const existingHy2 = db
      .prepare(
        sql`
          SELECT inbound_id
          FROM inbound_hysteria2
          WHERE inbound_id = ?
        `,
      )
      .get(inboundId) as { inbound_id: string } | undefined;

    if (existingHy2) {
      db.prepare(
        sql`
          UPDATE inbound_hysteria2
          SET
            up_mbps = ?,
            down_mbps = ?,
            ignore_client_bandwidth = ?,
            obfs_type = ?,
            obfs_password = ?,
            masquerade_string = ?,
            masquerade_type = ?,
            masquerade_file = ?,
            masquerade_directory = ?,
            masquerade_url = ?,
            bbr_profile = ?,
            brutal_debug = ?
          WHERE inbound_id = ?
        `,
      ).run(
        hysteria2Stored.up_mbps ?? null,
        hysteria2Stored.down_mbps ?? null,
        booleanToSqliteBool(hysteria2Stored.ignore_client_bandwidth),
        hysteria2Stored.obfs?.type ?? null,
        hysteria2Stored.obfs?.password ?? null,
        masqueradeRow.masquerade_string,
        masqueradeRow.masquerade_type,
        masqueradeRow.masquerade_file,
        masqueradeRow.masquerade_directory,
        masqueradeRow.masquerade_url,
        hysteria2Stored.bbr_profile ?? null,
        booleanToSqliteBool(hysteria2Stored.brutal_debug),
        inboundId,
      );
    } else {
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
        hysteria2Stored.up_mbps ?? null,
        hysteria2Stored.down_mbps ?? null,
        booleanToSqliteBool(hysteria2Stored.ignore_client_bandwidth),
        hysteria2Stored.obfs?.type ?? null,
        hysteria2Stored.obfs?.password ?? null,
        masqueradeRow.masquerade_string,
        masqueradeRow.masquerade_type,
        masqueradeRow.masquerade_file,
        masqueradeRow.masquerade_directory,
        masqueradeRow.masquerade_url,
        hysteria2Stored.bbr_profile ?? null,
        booleanToSqliteBool(hysteria2Stored.brutal_debug),
      );
    }

    syncHysteria2Users(db, inboundId, hysteria2Stored.users);

    return true;
  });

  return trx(tag, stored);
}
