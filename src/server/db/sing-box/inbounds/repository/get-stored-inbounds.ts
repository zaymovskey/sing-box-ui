import { getDb } from "@/server/db/client";
import { getSecurityAssets } from "@/server/db/security-assets";
import {
  InboundHysteria2RowSchema,
  InboundRowSchema,
  InboundUserRowSchema,
  InboundVlessRowSchema,
  type SecurityAsset,
  type StoredHysteria2Inbound,
  type StoredInbound,
  type StoredVlessInbound,
} from "@/shared/api/contracts";

import {
  mapMasqueradeFromRow,
  mapTlsFromSecurityAssetForHy2,
  mapTlsFromSecurityAssetForVless,
  mapTransportFromRow,
  sqliteBoolToBoolean,
} from "../../helpers";

const sql = String.raw;

export function getStoredInbounds(): StoredInbound[] {
  const db = getDb();

  const inboundRows = db
    .prepare(
      sql`
        SELECT
          id,
          display_tag,
          internal_tag,
          type,
          listen,
          listen_port,
          sniff,
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
          reality_public_key,
          multiplex_enabled,
          multiplex_padding,
          multiplex_brutal_enabled,
          multiplex_brutal_up_mbps,
          multiplex_brutal_down_mbps,
          transport_json
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
          masquerade_json,
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
        internal_name,
        display_name,
        uuid,
        flow,
        password,
        up_traffic_total,
        down_traffic_total,
        last_seen_up_counter,
        last_seen_down_counter,
        last_up_traffic_at,
        last_down_traffic_at
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

      const vlessUsers: StoredVlessInbound["users"] = (
        usersByInboundId.get(row.id) ?? []
      ).map((user) => ({
        display_name: user.display_name ?? "",
        internal_name: user.internal_name ?? "",
        uuid: user.uuid ?? "",
        flow: user.flow === "xtls-rprx-vision" ? "xtls-rprx-vision" : undefined,
      }));

      const inbound: StoredVlessInbound = {
        id: row.id,
        type: "vless",
        display_tag: row.display_tag ?? "",
        internal_tag: row.internal_tag ?? "",
        listen: row.listen ?? undefined,
        listen_port: row.listen_port,
        sniff: sqliteBoolToBoolean(row.sniff),
        users: vlessUsers,
        tls: mapTlsFromSecurityAssetForVless(
          linkedAsset,
          sqliteBoolToBoolean(vlessRow?.tls_enabled ?? null),
          vlessRow?.reality_public_key ?? null,
        ),
        _security_asset_id: row.security_asset_id ?? undefined,
        _tls_enabled: sqliteBoolToBoolean(vlessRow?.tls_enabled ?? null),
        multiplex: {
          enabled:
            sqliteBoolToBoolean(vlessRow?.multiplex_enabled ?? null) ?? false,
          padding:
            sqliteBoolToBoolean(vlessRow?.multiplex_padding ?? null) ?? false,
          brutal: {
            enabled:
              sqliteBoolToBoolean(vlessRow?.multiplex_brutal_enabled ?? null) ??
              false,
            up_mbps: vlessRow?.multiplex_brutal_up_mbps ?? 0,
            down_mbps: vlessRow?.multiplex_brutal_down_mbps ?? 0,
          },
        },
        transport: vlessRow ? mapTransportFromRow(vlessRow) : undefined,
      };

      return inbound;
    }

    const hysteria2Row = hysteria2ByInboundId.get(row.id);

    const hysteria2Users: StoredHysteria2Inbound["users"] = (
      usersByInboundId.get(row.id) ?? []
    ).map((user) => ({
      password: user.password ?? "",
      internal_name: user.internal_name ?? "",
      display_name: user.display_name ?? "",
    }));

    const inbound: StoredHysteria2Inbound = {
      id: row.id,
      type: "hysteria2",
      display_tag: row.display_tag ?? "",
      internal_tag: row.internal_tag ?? "",
      listen: row.listen ?? undefined,
      listen_port: row.listen_port,
      sniff: sqliteBoolToBoolean(row.sniff),
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
