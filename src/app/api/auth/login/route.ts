import { LoginRequestSchema, OkResponseSchema } from "@/shared/api/contracts";
import {
  getServerEnv,
  ServerApiError,
  setSessionCookie,
  signSession,
  withRoute,
} from "@/shared/lib/server";

/**
 * Login user
 * @description Logs in a user with email and password.
 * @operationId login
 * @tag Auth
 *
 * @responseSet login
 *
 * @body LoginRequestSchema
 * @response 200:OkResponseSchema
 * @add 401:ApiErrorPayloadSchema
 *
 * @openapi
 */
export const POST = withRoute({
  auth: false,
  responseSchema: OkResponseSchema,
  requestSchema: LoginRequestSchema,
  handler: async ({ body }) => {
    const email = body.email.trim();
    const password = body.password;

    const serverEnv = getServerEnv();
    const demoEmail = serverEnv.AUTH_DEMO_EMAIL;
    const demoPassword = serverEnv.AUTH_DEMO_PASSWORD;

    if (email !== demoEmail || password !== demoPassword) {
      throw new ServerApiError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid credentials",
      );
    }

    const token = await signSession({
      sub: "1",
      email,
      role: "admin",
    });

    await setSessionCookie(token);

    return { ok: true };
  },
});
