import fs from "node:fs";
import path from "node:path";

const filesToCopy = [
  {
    from: path.resolve("worker/grpc/stats.proto"),
    to: path.resolve(".worker-dist/worker/grpc/stats.proto"),
  },
];

for (const file of filesToCopy) {
  fs.mkdirSync(path.dirname(file.to), { recursive: true });
  fs.copyFileSync(file.from, file.to);
}
