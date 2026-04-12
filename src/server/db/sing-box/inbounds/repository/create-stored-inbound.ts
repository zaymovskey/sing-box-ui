import { randomUUID } from "node:crypto";

import { getDb } from "@/server/db/client";
import { type OkResponse, type SaveInboundInput } from "@/shared/api/contracts";

import { booleanToSqliteBool, mapMasqueradeToRow } from "../../helpers";

const sql = String.raw;

function makeInternalTag(inboundId: string): string {
  return `inbound_${inboundId}`;
}

function makeInternalUserName(userId: string): string {
  return `user_${userId}`;
}

export function createStoredInbound(input: SaveInboundInput): OkResponse {
  const db = getDb();
  const now = new Date().toISOString();
  const inboundId = randomUUID();
  const internalTag = input.internal_tag ?? makeInternalTag(inboundId);

  const trx = db.transaction((saveInput: SaveInboundInput) => {
    db.prepare(
      sql`
        INSERT INTO inbounds (
          id,
          display_tag,
          internal_tag,
          type,
          listen,
          listen_port,
          sniff,
          sniff_override_destination,
          security_asset_id,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      inboundId,
      saveInput.display_tag,
      internalTag,
      saveInput.type,
      saveInput.listen ?? null,
      saveInput.listen_port ?? null,
      booleanToSqliteBool(saveInput.sniff),
      booleanToSqliteBool(saveInput.sniff_override_destination),
      saveInput._security_asset_id ?? null,
      now,
      now,
    );

    if (saveInput.type === "vless") {
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
            multiplex_brutal_down_mbps
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      );

      saveInput.users.forEach((user, index) => {
        const userId = randomUUID();
        const internalName = user.internal_name ?? makeInternalUserName(userId);

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
      });

      return { ok: true } as const;
    }

    const masqueradeRow = mapMasqueradeToRow(saveInput.masquerade);

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

    saveInput.users.forEach((user, index) => {
      const userId = randomUUID();
      const internalName = user.internal_name ?? makeInternalUserName(userId);

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
    });

    return { ok: true } as const;
  });

  return trx(input);
}
