import { getDb } from "@/shared/lib/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPoll() {
  const db = getDb();

  const row = db.prepare("SELECT 1 as ok").get();
  console.log("[worker] db ok:", row);
}

async function main() {
  console.log("[worker] started");

  while (true) {
    try {
      await runPoll();
    } catch (error) {
      console.error("[worker] poll failed:", error);
    }

    await sleep(10_000);
  }
}

main().catch((error) => {
  console.error("[worker] fatal error:", error);
  process.exit(1);
});
