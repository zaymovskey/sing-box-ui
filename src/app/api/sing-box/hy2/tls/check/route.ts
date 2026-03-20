import {
  createPrivateKey,
  createPublicKey,
  X509Certificate,
} from "node:crypto";
import { constants as fsConstants } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

import {
  Hy2TlsCheckRequestSchema,
  type Hy2TlsCheckResponse,
  Hy2TlsCheckResponseSchema,
} from "@/shared/api/contracts";
import { getServerEnv, withRoute } from "@/shared/lib/server";

const serverEnv = getServerEnv();

const HOST_CERTS_DIR = path.resolve(
  process.cwd(),
  "docker" + serverEnv.SINGBOX_CERTS_DIR,
);

function resolveHostCertPath(containerPath: string): string | null {
  const containerBaseDir = path.posix
    .normalize(serverEnv.SINGBOX_CERTS_DIR)
    .replace(/\/+$/, "");
  const normalizedContainerPath = path.posix.normalize(containerPath);

  const isInsideBaseDir =
    normalizedContainerPath === containerBaseDir ||
    normalizedContainerPath.startsWith(containerBaseDir + "/");

  if (!isInsideBaseDir) {
    return null;
  }

  const relativePath = path.posix.relative(
    containerBaseDir,
    normalizedContainerPath,
  );

  if (!relativePath || relativePath.startsWith("..")) {
    return null;
  }

  return path.resolve(HOST_CERTS_DIR, relativePath);
}

async function checkFilePresence(
  filePath: string,
): Promise<"success" | "not_found" | "no_access"> {
  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      return "not_found";
    }

    await access(filePath, fsConstants.R_OK);
    return "success";
  } catch (error) {
    const code =
      typeof error === "object" &&
      error &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : "";

    if (code === "ENOENT") {
      return "not_found";
    }

    if (code === "EACCES" || code === "EPERM") {
      return "no_access";
    }

    return "no_access";
  }
}

async function validateCertificate(
  filePath: string,
): Promise<"success" | "not_found" | "no_access" | "invalid"> {
  const presence = await checkFilePresence(filePath);
  if (presence !== "success") {
    return presence;
  }

  try {
    const pem = await readFile(filePath, "utf-8");
    new X509Certificate(pem);
    return "success";
  } catch {
    return "invalid";
  }
}

async function validatePrivateKey(
  filePath: string,
): Promise<"success" | "not_found" | "no_access" | "invalid"> {
  const presence = await checkFilePresence(filePath);
  if (presence !== "success") {
    return presence;
  }

  try {
    const pem = await readFile(filePath, "utf-8");
    createPrivateKey(pem);
    return "success";
  } catch {
    return "invalid";
  }
}

async function validatePair(
  certificatePath: string,
  keyPath: string,
): Promise<"success" | "mismatch" | "invalid"> {
  try {
    const certPem = await readFile(certificatePath, "utf-8");
    const keyPem = await readFile(keyPath, "utf-8");

    const cert = new X509Certificate(certPem);
    const privateKey = createPrivateKey(keyPem);

    const certPublicKeyPem = cert.publicKey.export({
      format: "pem",
      type: "spki",
    });

    const privateKeyPublicPem = createPublicKey(privateKey).export({
      format: "pem",
      type: "spki",
    });

    return certPublicKeyPem === privateKeyPublicPem ? "success" : "mismatch";
  } catch {
    return "invalid";
  }
}

/**
 * Check Hysteria2 TLS certificate and key
 * @description Validates Hysteria2 TLS files stored in the managed sing-box certificates directory.
 * Checks that the certificate and key exist, are readable, are valid PEM files, and match each other.
 * @tag SingBox
 *
 * @body Hy2TlsCheckRequestSchema
 * @response 200:Hy2TlsCheckResponseSchema
 * @add 401:ApiErrorPayloadSchema
 * @add 503:ApiErrorPayloadSchema
 *
 * @openapi
 */
export const POST = withRoute({
  auth: true,
  requestSchema: Hy2TlsCheckRequestSchema,
  responseSchema: Hy2TlsCheckResponseSchema,
  handler: async ({ body }) => {
    const certPath = resolveHostCertPath(body.certificatePath);
    const keyPath = resolveHostCertPath(body.keyPath);

    const result: Hy2TlsCheckResponse = {
      cert: "skipped",
      key: "skipped",
      pair: "skipped",
    };

    if (!certPath) {
      result.cert = "outside_allowed_dir";
    } else {
      result.cert = await validateCertificate(certPath);
    }

    if (!keyPath) {
      result.key = "outside_allowed_dir";
    } else {
      result.key = await validatePrivateKey(keyPath);
    }

    if (result.cert === "success" && result.key === "success") {
      result.pair = await validatePair(certPath!, keyPath!);
    }

    return result;
  },
});
