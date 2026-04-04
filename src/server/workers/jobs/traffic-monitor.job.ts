export function startTrafficMonitor() {
  setInterval(async () => {
    console.log("[traffic] tick");
  }, 5000);
}
