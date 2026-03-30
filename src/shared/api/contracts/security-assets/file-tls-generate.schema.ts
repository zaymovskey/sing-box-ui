import z from "zod";

export const TLSFileGenerateRequestSchema = z.object({
  certificatePath: z.string().trim().min(1),
  keyPath: z.string().trim().min(1),
  serverName: z.string().trim().min(1),
  overwrite: z.boolean().optional().default(false),
});

export const TLSGenerateResultSchema = z.enum([
  "generated",
  "overwritten",
  "conflict",
  "error",
]);

export const TLSFileGenerateResponseSchema = z.object({
  result: TLSGenerateResultSchema,
  message: z.string(),
});

export type TLSFileGenerateRequest = z.infer<
  typeof TLSFileGenerateRequestSchema
>;
export type TLSFileGenerateResponse = z.infer<
  typeof TLSFileGenerateResponseSchema
>;
