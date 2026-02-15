import { OkResponseSchema } from "@/shared/api/contracts";
import { clearSessionCookie, withRoute } from "@/shared/lib/server";

/**
 * Logout
 * @description Logs out the currently authenticated user.
 * @responseSet logout
 * @tag Auth
 *
 * @response 200:OkResponseSchema
 * @add 401:ApiErrorPayloadSchema
 *
 * @security CookieAuth
 *
 * @openapi
 */
export const POST = withRoute({
  auth: true,
  responseSchema: OkResponseSchema,
  handler: async () => {
    await clearSessionCookie();
    return { ok: true };
  },
});
