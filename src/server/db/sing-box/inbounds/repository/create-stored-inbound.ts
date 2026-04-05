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

export function createStoredInbound(input: SaveInboundInput): { ok: true } {
  const db = getDb();
  const now = new Date().toISOString();
  const inboundId = randomUUID();
  const stored = ensureInternalNames(input);

  const trx = db.transaction((normalized: StoredInbound) => {
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
      normalized.tag ?? null,
      normalized.type,
      normalized.listen ?? null,
      normalized.listen_port ?? null,
      booleanToSqliteBool(normalized.sniff),
      booleanToSqliteBool(normalized.sniff_override_destination),
      normalized._security_asset_id ?? null,
      now,
      now,
    );

    if (normalized.type === "vless") {
      const vlessStored: StoredVlessInbound = normalized;

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

      vlessStored.users.forEach((user, index) => {
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
      });

      return { ok: true } as const;
    }

    const hysteria2Stored: StoredHysteria2Inbound = normalized;
    const masqueradeRow = mapMasqueradeToRow(hysteria2Stored.masquerade);

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

    hysteria2Stored.users.forEach((user, index) => {
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
    });

    return { ok: true } as const;
  });

  return trx(stored);
}
