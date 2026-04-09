/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

function resolveProtoPath(): string {
  const distPath = path.resolve(
    process.cwd(),
    ".worker-dist/server/worker/grpc/stats.proto",
  );

  if (fs.existsSync(distPath)) {
    return distPath;
  }

  return path.resolve(__dirname, "../../grpc/stats.proto");
}

export const PROTO_PATH = resolveProtoPath();

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
