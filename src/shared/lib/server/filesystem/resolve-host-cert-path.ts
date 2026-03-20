import path from "node:path";

import { getServerEnv } from "../env-server";

const serverEnv = getServerEnv();

export function resolveHostCertPath(containerPath: string): string | null {
  const baseDir = path.posix
    .normalize(serverEnv.SINGBOX_CERTS_DIR)
    .replace(/\/+$/, "");

  const normalizedPath = path.posix.normalize(containerPath);

  const isInsideBaseDir =
    normalizedPath === baseDir || normalizedPath.startsWith(baseDir + "/");

  if (!isInsideBaseDir) {
    return null;
  }

  return normalizedPath;
}
