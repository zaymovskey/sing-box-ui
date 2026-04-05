// import { getDb } from "@/server/db/client";

import { queryStats } from "./test-v2ray-api";

interface TrafficStats {
  stat: { name: string; value: string }[];
}

// const sql = String.raw;

export function startTrafficMonitor() {
  // const db = getDb();

  setInterval(async () => {
    queryStats()
      .then((res) => {
        const stats: TrafficStats = res as TrafficStats;
        for (const statItem of stats.stat) {
          if (!statItem.name.startsWith("user>>>")) {
            continue;
          }
          // const isUpLink = statItem.name.endsWith(">>>traffic>>>uplink");

          //     if (!isUpLink) {
          //       db.prepare(
          //         sql`
          //   UPDATE security_assets
          //   SET
          //     name = ?,
          //     kind = ?,
          //     server_name = ?,
          //     updated_at = ?
          //   WHERE name = ?
          // `,
          //       ).run(
          //         input.name,
          //         input.type,
          //         input.serverName ?? null,
          //         input.updatedAt,
          //         input.id,
          //       );
          //     }
        }
        // console.log("[traffic] stats:");
        // console.dir(res, { depth: null });
      })
      .catch((err) => {
        console.error("[traffic] query stats error:");
        console.error(err);
      });
    // console.log("[traffic] tick 9999");
  }, 5000);
}
