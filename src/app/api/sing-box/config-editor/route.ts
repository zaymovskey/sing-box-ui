import { z } from "zod";

import { OkResponseSchema } from "@/shared/api/contracts";
import { ServerApiError, withRoute } from "@/shared/lib/server";

export const GET = withRoute({
  auth: true,
  responseSchema: z.unknown(),
  handler: async () => {
    throw new ServerApiError(
      500,
      "NOT_SUPPORTED",
      "Ручное редактирование конфига sing-box через JSON сейчас не поддерживается",
    );
  },
});

export const PUT = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async () => {
    throw new ServerApiError(
      500,
      "NOT_SUPPORTED",
      "Ручное редактирование конфига sing-box через JSON сейчас не поддерживается",
    );
  },
});
