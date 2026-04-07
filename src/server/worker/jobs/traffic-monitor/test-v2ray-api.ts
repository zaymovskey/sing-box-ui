/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "node:path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.resolve(
  process.cwd(),
  "src/server/worker/grpc/stats.proto",
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const StatsService = proto.v2ray.core.app.stats.command.StatsService;

const client = new StatsService(
  "127.0.0.1:4444",
  grpc.credentials.createInsecure(),
);

export async function queryStats() {
  return new Promise((resolve, reject) => {
    client.QueryStats(
      {
        pattern: "",
        reset: false,
      },
      (err: any, response: any) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      },
    );
  });
}

// async function main() {
//   try {
//     console.log("🚀 calling v2ray api...");

//     const res = await queryStats();

//     console.log("✅ RESPONSE:");
//     console.dir(res, { depth: null });
//   } catch (err) {
//     console.error("❌ ERROR:");
//     console.error(err);
//   }
// }

// main();
