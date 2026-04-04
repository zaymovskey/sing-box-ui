import { startTrafficMonitor } from "./jobs/traffic-monitor.job";

async function main() {
  console.log("[worker] started");

  startTrafficMonitor();
}

main();
