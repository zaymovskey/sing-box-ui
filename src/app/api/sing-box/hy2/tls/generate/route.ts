import {
  Hy2TlsGenerateRequestSchema,
  type Hy2TlsGenerateResponse,
  Hy2TlsGenerateResponseSchema,
} from "@/shared/api/contracts";
import { checkFilePresence, withRoute } from "@/shared/lib/server";

/**
 * Check Hysteria2 TLS certificate and key
 * @description Validates Hysteria2 TLS files stored in the managed sing-box certificates directory.
 * Checks that the certificate and key exist, are readable, are valid PEM files, and match each other.
 * @tag SingBox
 *
 * @body Hy2TlsGenerateRequestSchema
 * @response 200:Hy2TlsGenerateResponseSchema
 * @add 401:ApiErrorPayloadSchema
 * @add 503:ApiErrorPayloadSchema
 *
 * @openapi
 */
export const POST = withRoute({
  auth: true,
  requestSchema: Hy2TlsGenerateRequestSchema,
  responseSchema: Hy2TlsGenerateResponseSchema,
  handler: async ({ body }) => {
    const isThereCert = await checkFilePresence(body.certificatePath);
    const isThereKey = await checkFilePresence(body.keyPath);
    const overwrite = body.overwrite;

    // Есть ли сертификат или ключ, и не разрешено ли перезаписывать существующие файлы
    if ((isThereCert === "exists" || isThereKey === "exists") && !overwrite) {
      let message: string;

      if (isThereCert === "exists" && isThereKey === "exists") {
        message = "Сертификат и ключ уже существуют по заданным путям";
      } else if (isThereCert === "exists") {
        message = "Сертификат уже существует по заданному пути";
      } else {
        message = "Ключ уже существует по заданному пути";
      }
      return {
        result: "conflict",
        message,
      } satisfies Hy2TlsGenerateResponse;
    }

    return {
      result: "error",
      message: "Certificate generation is not implemented yet.",
    } satisfies Hy2TlsGenerateResponse;
  },
});
