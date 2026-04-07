import { getDb } from "@/server/db/client";
import {
  getInboundUserByInternalName,
  updateInboundUserTraffic,
} from "@/server/db/sing-box/inbounds";

import { queryStats } from "./test-v2ray-api";

interface TrafficStats {
  stat: { name: string; value: string }[];
}

export function startTrafficMonitor() {
  const db = getDb();

  setInterval(async () => {
    try {
      const res = await queryStats();
      const stats: TrafficStats = res as TrafficStats;

      const tx = db.transaction(() => {
        for (const statItem of stats.stat) {
          if (!statItem.name.startsWith("user>>>")) {
            continue;
          }

          let linkType: "uplink" | "downlink";

          if (statItem.name.endsWith(">>>traffic>>>uplink")) {
            linkType = "uplink";
          } else if (statItem.name.endsWith(">>>traffic>>>downlink")) {
            linkType = "downlink";
          } else {
            continue;
          }

          const userInternalName = statItem.name.split(">>>")[1];
          const trafficValue = Number.parseInt(statItem.value, 10);

          if (Number.isNaN(trafficValue) || trafficValue < 0) {
            console.warn(
              `[traffic] invalid traffic value for ${statItem.name}: ${statItem.value}`,
            );
            continue;
          }

          const dbUser = getInboundUserByInternalName(userInternalName);

          if (!dbUser) {
            console.warn(
              `[traffic] user with internal name ${userInternalName} not found in db`,
            );
            continue;
          }

          const prefix = linkType === "uplink" ? "up" : "down";
          const delta = trafficValue - dbUser[`last_seen_${prefix}_counter`];

          if (delta > 0) {
            console.log(
              `[traffic] user ${dbUser.id} (${dbUser.internal_name}) ${prefix}link traffic increased by ${delta} bytes (total: ${dbUser[`${prefix}_traffic_total`] + delta} bytes)`,
            );
            updateInboundUserTraffic(
              prefix,
              dbUser.id,
              trafficValue,
              dbUser[`${prefix}_traffic_total`] + delta,
            );
          } else if (delta === 0) {
            console.log(
              `[traffic] user ${dbUser.id} (${dbUser.internal_name}) ${prefix}link traffic unchanged at ${trafficValue} bytes`,
            );
            continue;
          } else {
            console.log(
              `[traffic] user ${dbUser.id} (${dbUser.internal_name}) ${prefix}link traffic counter reset`,
            );
            updateInboundUserTraffic(
              prefix,
              dbUser.id,
              trafficValue,
              dbUser[`${prefix}_traffic_total`] + trafficValue,
            );
          }
        }
      });

      tx();
    } catch (err) {
      console.error("[traffic] query stats error:");
      console.error(err);
    }
  }, 5000);
}
