import { MeResponseSchema } from "@/shared/api/contracts";
import { withRoute } from "@/shared/lib/server";

/**
 * Update sing-box config
 * @description Updates the current sing-box configuration. Requires authentication.
 * @responseSet updateSingBoxConfig
 * @tag SingBox
 *
 * @body DocConfigSchema
 * @response 200:OkResponseSchema
 * @add 401:ApiErrorPayloadSchema
 * @add 503:ApiErrorPayloadSchema
 *
 * @openapi
 */

/**
 * Get current user
 * @description Returns the currently authenticated user's profile (id, email, roles).
 * @responseSet getCurrentUser
 * @tag Auth
 *
 * @response 200:MeResponseSchema
 * @add 401:ApiErrorPayloadSchema
 *
 * @security CookieAuth
 *
 * @openapi
 */
export const GET = withRoute({
  auth: true,
  responseSchema: MeResponseSchema,
  handler: async ({ session }) => ({
    id: session.sub,
    email: session.email,
    roles: [session.role],
  }),
});
