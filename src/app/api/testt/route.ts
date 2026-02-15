import { z } from "zod";

export const TesttResponseSchema = z.object({
  ok: z.literal(true),
});

export type TesttResponse = z.infer<typeof TesttResponseSchema>;

/**
 * @openapi
 * @summary Test endpoint
 * @response 200 TesttResponseSchema
 */
export const GET = async () => {
  return Response.json({ ok: true });
};
