import { OkResponseSchema } from "@/shared/api/contracts";
import { clearSessionCookie, withRoute } from "@/shared/lib/server";

export const POST = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async () => {
    await clearSessionCookie();
    return { ok: true };
  },
});
