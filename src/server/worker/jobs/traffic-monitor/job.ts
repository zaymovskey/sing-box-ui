import { queryStats } from "./test-v2ray-api";

export function startTrafficMonitor() {
  setInterval(async () => {
    queryStats()
      .then((res) => {
        console.log("[traffic] stats:");
        console.dir(res, { depth: null });
      })
      .catch((err) => {
        console.error("[traffic] query stats error:");
        console.error(err);
      });
    console.log("[traffic] tick 9999");
  }, 5000);
}
