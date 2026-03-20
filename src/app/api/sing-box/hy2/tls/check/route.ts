import {
  createPrivateKey,
  createPublicKey,
  X509Certificate,
} from "node:crypto";
import { readFile } from "node:fs/promises";

import {
  Hy2TlsCheckRequestSchema,
  type Hy2TlsCheckResponse,
  Hy2TlsCheckResponseSchema,
} from "@/shared/api/contracts";
import {
  checkFilePresence,
  resolveHostCertPath,
  withRoute,
} from "@/shared/lib/server";

async function validateCertificate(
  filePath: string,
): Promise<"success" | "not_found" | "no_access" | "invalid"> {
  const presence = await checkFilePresence(filePath);
  if (presence !== "exists") {
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
  if (presence !== "exists") {
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
 * Проверка TLS-сертификата и ключа Hysteria2
 * @description Валидирует TLS-файлы Hysteria2, хранящиеся в управляемой директории сертификатов sing-box.
 * Проверяет, что сертификат и ключ существуют, доступны для чтения, являются корректными PEM-файлами и соответствуют друг другу.
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
