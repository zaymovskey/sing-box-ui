import { getDb } from "@/server/db/client";

export function updateInboundUserTraffic(
  prefix: "up" | "down",
  userId: string,
  trafficValue: number,
  totalTraffic: number,
) {
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(
    `
      UPDATE inbound_users
      SET
        ${prefix}_traffic_total = ?,
        last_seen_${prefix}_counter = ?,
        last_${prefix}_traffic_at = ?
      WHERE id = ?
    `,
  ).run(totalTraffic, trafficValue, now, userId);
}
