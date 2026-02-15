import z from "zod";

export const OkResponseSchema = z.object({
  ok: z.boolean(),
});
export type OkResponse = z.infer<typeof OkResponseSchema>;
