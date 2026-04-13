/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

function resolveProtoPath(): string {
  const candidates = [
    // worker build output (see worker/tsconfig.worker.json outDir)
    path.resolve(process.cwd(), ".worker-dist/worker/grpc/stats.proto"),
    // legacy candidate kept as fallback for older layouts
    path.resolve(process.cwd(), ".worker-dist/server/worker/grpc/stats.proto"),
    // dev / source tree
    path.resolve(process.cwd(), "worker/grpc/stats.proto"),
    // fallback (in case cwd is worker/)
    path.resolve(process.cwd(), "grpc/stats.proto"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(
    `[traffic] stats.proto not found. Tried:\n${candidates.map((p) => `- ${p}`).join("\n")}`,
  );
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
