import { randomUUID } from "node:crypto";

import { getDb } from "@/server/db/client";
import {
  type InboundDbType,
  type SaveHysteria2Inbound,
  type SaveInboundInput,
  type SaveVlessInbound,
} from "@/shared/api/contracts";

import {
  booleanToSqliteBool,
  mapMasqueradeToRow,
  mapTransportToRow,
} from "../../helpers";

const sql = String.raw;

type ExistingInboundUserRow = {
  id: string;
  internal_name: string;
};

type ExistingInboundRow = {
  id: string;
  type: InboundDbType;
  internal_tag: string;
};

function makeInternalUserName(userId: string): string {
  return `user_${userId}`;
}

function syncVlessUsers(
  db: ReturnType<typeof getDb>,
  inboundId: string,
  users: SaveVlessInbound["users"],
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
    users
      .map((user) => user.internal_name)
      .filter((value): value is string => Boolean(value)),
  );

  for (const [index, user] of users.entries()) {
    const existing = user.internal_name
      ? existingByInternalName.get(user.internal_name)
      : undefined;

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

    const userId = randomUUID();
    const internalName = makeInternalUserName(userId);

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
      userId,
      inboundId,
      "vless",
      index,
      internalName,
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
  users: SaveHysteria2Inbound["users"],
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
    users
      .map((user) => user.internal_name)
      .filter((value): value is string => Boolean(value)),
  );

  for (const [index, user] of users.entries()) {
    const existing = user.internal_name
      ? existingByInternalName.get(user.internal_name)
      : undefined;

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

    const userId = randomUUID();
    const internalName = makeInternalUserName(userId);

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
      userId,
      inboundId,
      "hysteria2",
      index,
      internalName,
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

export function updateStoredInboundByDisplayTag(
  internalTag: string,
  input: SaveInboundInput,
): boolean {
  const db = getDb();
  const now = new Date().toISOString();

  const trx = db.transaction(
    (currentInternalTag: string, saveInput: SaveInboundInput) => {
      const existing = db
        .prepare(
          sql`
            SELECT
              id,
              type,
              internal_tag
            FROM inbounds
            WHERE internal_tag = ?
          `,
        )
        .get(currentInternalTag) as ExistingInboundRow | undefined;

      if (!existing) {
        return false;
      }

      const inboundId = existing.id;
      const internalTag = saveInput.internal_tag ?? existing.internal_tag;

      db.prepare(
        sql`
          UPDATE inbounds
          SET
            display_tag = ?,
            internal_tag = ?,
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
        saveInput.display_tag,
        internalTag,
        saveInput.type,
        saveInput.listen ?? null,
        saveInput.listen_port ?? null,
        booleanToSqliteBool(saveInput.sniff),
        booleanToSqliteBool(saveInput.sniff_override_destination),
        saveInput._security_asset_id ?? null,
        now,
        inboundId,
      );

      if (saveInput.type === "vless") {
        const transportRow = mapTransportToRow(saveInput.transport);

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
                reality_public_key = ?,
                multiplex_enabled = ?,
                multiplex_padding = ?,
                multiplex_brutal_enabled = ?,
                multiplex_brutal_up_mbps = ?,
                multiplex_brutal_down_mbps = ?,
                transport_json = ?
              WHERE inbound_id = ?
            `,
          ).run(
            booleanToSqliteBool(saveInput._tls_enabled),
            saveInput.tls?.reality?._reality_public_key ?? null,
            booleanToSqliteBool(saveInput.multiplex?.enabled ?? false),
            booleanToSqliteBool(saveInput.multiplex?.padding ?? false),
            booleanToSqliteBool(saveInput.multiplex?.brutal?.enabled ?? false),
            saveInput.multiplex?.brutal?.up_mbps ?? 0,
            saveInput.multiplex?.brutal?.down_mbps ?? 0,
            transportRow.transport_json,
            inboundId,
          );
        } else {
          db.prepare(
            sql`
              INSERT INTO inbound_vless (
                inbound_id,
                tls_enabled,
                reality_public_key,
                multiplex_enabled,
                multiplex_padding,
                multiplex_brutal_enabled,
                multiplex_brutal_up_mbps,
                multiplex_brutal_down_mbps,
                transport_json
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
          ).run(
            inboundId,
            booleanToSqliteBool(saveInput._tls_enabled),
            saveInput.tls?.reality?._reality_public_key ?? null,
            booleanToSqliteBool(saveInput.multiplex?.enabled ?? false),
            booleanToSqliteBool(saveInput.multiplex?.padding ?? false),
            booleanToSqliteBool(saveInput.multiplex?.brutal?.enabled ?? false),
            saveInput.multiplex?.brutal?.up_mbps ?? 0,
            saveInput.multiplex?.brutal?.down_mbps ?? 0,
            transportRow.transport_json,
          );
        }

        syncVlessUsers(db, inboundId, saveInput.users);

        return true;
      }

      const masqueradeRow = mapMasqueradeToRow(saveInput.masquerade);

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
              masquerade_json = ?,
              bbr_profile = ?,
              brutal_debug = ?
            WHERE inbound_id = ?
          `,
        ).run(
          saveInput.up_mbps ?? null,
          saveInput.down_mbps ?? null,
          booleanToSqliteBool(saveInput.ignore_client_bandwidth),
          saveInput.obfs?.type ?? null,
          saveInput.obfs?.password ?? null,
          masqueradeRow.masquerade_json,
          saveInput.bbr_profile ?? null,
          booleanToSqliteBool(saveInput.brutal_debug),
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
              masquerade_json,
              bbr_profile,
              brutal_debug
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
        ).run(
          inboundId,
          saveInput.up_mbps ?? null,
          saveInput.down_mbps ?? null,
          booleanToSqliteBool(saveInput.ignore_client_bandwidth),
          saveInput.obfs?.type ?? null,
          saveInput.obfs?.password ?? null,
          masqueradeRow.masquerade_json,
          saveInput.bbr_profile ?? null,
          booleanToSqliteBool(saveInput.brutal_debug),
        );
      }

      syncHysteria2Users(db, inboundId, saveInput.users);

      return true;
    },
  );

  return trx(internalTag, input);
}
