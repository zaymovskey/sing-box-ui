import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import {
  TLSFileGenerateRequestSchema,
  type TLSFileGenerateResponse,
  TLSFileGenerateResponseSchema,
} from "@/shared/api/contracts";
import {
  checkFilePresence,
  generateSelfSignedFilesCert,
  resolveHostCertPath,
  withRoute,
} from "@/shared/server";

export const runtime = "nodejs";

export const POST = withRoute({
  auth: true,
  requestSchema: TLSFileGenerateRequestSchema,
  responseSchema: TLSFileGenerateResponseSchema,
  handler: async ({ body }) => {
    const certificatePath = resolveHostCertPath(body.certificatePath);
    const keyPath = resolveHostCertPath(body.keyPath);

    // Если сертификат или ключ не находятся в управляемой директории сертификатов, возвращаем ошибку
    if (!certificatePath || !keyPath) {
      let message: string;

      if (!certificatePath && !keyPath) {
        message =
          "Сертификат и ключ должны находиться в управляемой директории сертификатов.";
      } else if (!certificatePath) {
        message =
          "Сертификат должен находиться в управляемой директории сертификатов.";
      } else {
        message =
          "Ключ должен находиться в управляемой директории сертификатов.";
      }

      return {
        result: "error",
        message,
      } satisfies TLSFileGenerateResponse;
    }

    const isThereCert = await checkFilePresence(certificatePath);
    const isThereKey = await checkFilePresence(keyPath);
    const overwrite = body.overwrite;
    const commonName = body.serverName;

    // Есть ли сертификат или ключ, и не разрешено перезаписывать существующие файлы
    if ((isThereCert === "exists" || isThereKey === "exists") && !overwrite) {
      let message: string;
      const postfix =
        '. Если вы хотите перезаписать существующие файлы, установите флаг "overwrite" в true.';

      if (isThereCert === "exists" && isThereKey === "exists") {
        message =
          "Сертификат и ключ уже существуют по заданным путям" + postfix;
      } else if (isThereCert === "exists") {
        message = "Сертификат уже существует по заданному пути" + postfix;
      } else {
        message = "Ключ уже существует по заданному пути" + postfix;
      }
      return {
        result: "conflict",
        message,
      } satisfies TLSFileGenerateResponse;
    }

    try {
      await mkdir(path.posix.dirname(certificatePath), { recursive: true });
      await mkdir(path.posix.dirname(keyPath), { recursive: true });

      if (overwrite) {
        await rm(certificatePath, { force: true });
        await rm(keyPath, { force: true });
      }

      await generateSelfSignedFilesCert({
        certificatePath,
        keyPath,
        commonName,
      });

      return {
        result: "generated",
        message: "Сертификат и ключ успешно сгенерированы.",
      } satisfies TLSFileGenerateResponse;
    } catch (error) {
      return {
        result: "error",
        message:
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка при генерации сертификата.",
      } satisfies TLSFileGenerateResponse;
    }
  },
});
