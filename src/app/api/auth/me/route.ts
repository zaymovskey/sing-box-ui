import { MeResponseSchema } from "@/shared/api/contracts";
import { withRoute } from "@/shared/lib/server";

/**
 * Get current user
 * @response MeResponseSchema
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
