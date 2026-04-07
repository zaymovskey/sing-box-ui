import { getDb } from "@/server/db/client";
import {
  InboundRowSchema,
  type InboundStats,
  InboundUserRowSchema,
  type InboundUserStats,
} from "@/shared/api/contracts";

const sql = String.raw;
const ONLINE_WINDOW_MS = 30_000;

export function getInboundsStats(): InboundStats[] {
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

  const usersByInboundId = new Map<string, InboundUserStats[]>();

  for (const user of userRows) {
    const mappedUser: InboundUserStats = {
      id: user.id,
      inbound_id: user.inbound_id,
      internal_name: user.internal_name ?? "",
      display_name: user.display_name ?? "",
      up_traffic_total: user.up_traffic_total ?? 0,
      down_traffic_total: user.down_traffic_total ?? 0,
      last_seen_up_counter: user.last_seen_up_counter ?? 0,
      last_seen_down_counter: user.last_seen_down_counter ?? 0,
      last_up_traffic_at: user.last_up_traffic_at,
      last_down_traffic_at: user.last_down_traffic_at,
      is_online: isUserOnline(user),
    };

    const current = usersByInboundId.get(user.inbound_id) ?? [];
    current.push(mappedUser);
    usersByInboundId.set(user.inbound_id, current);
  }

  const inboundsStats: InboundStats[] = [];

  for (const inbound of inboundRows) {
    const users = usersByInboundId.get(inbound.id) ?? [];

    const upTrafficTotal = users.reduce(
      (sum, user) => sum + user.up_traffic_total,
      0,
    );
    const downTrafficTotal = users.reduce(
      (sum, user) => sum + user.down_traffic_total,
      0,
    );
    const onlineUsersCount = users.filter((user) => user.is_online).length;

    const inboundStats: InboundStats = {
      id: inbound.id,
      type: inbound.type,
      display_tag: inbound.display_tag ?? "",
      internal_tag: inbound.internal_tag ?? "",
      listen: inbound.listen,
      listen_port: inbound.listen_port,
      up_traffic_total: upTrafficTotal,
      down_traffic_total: downTrafficTotal,
      online_users_count: onlineUsersCount,
      users,
    };

    inboundsStats.push(inboundStats);
  }

  return inboundsStats;
}

export function isUserOnline(user: {
  last_up_traffic_at: string | null;
  last_down_traffic_at: string | null;
}): boolean {
  const upMs = user.last_up_traffic_at
    ? new Date(user.last_up_traffic_at).getTime()
    : null;

  const downMs = user.last_down_traffic_at
    ? new Date(user.last_down_traffic_at).getTime()
    : null;

  const lastActivityMs = Math.max(upMs ?? 0, downMs ?? 0);

  if (lastActivityMs === 0) {
    return false;
  }

  return Date.now() - lastActivityMs <= ONLINE_WINDOW_MS;
}
