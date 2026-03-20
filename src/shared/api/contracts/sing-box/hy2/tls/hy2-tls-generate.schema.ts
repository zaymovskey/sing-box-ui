import z from "zod";

export const Hy2TlsGenerateRequestSchema = z.object({
  certificatePath: z.string().trim().min(1),
  keyPath: z.string().trim().min(1),
  overwrite: z.boolean().optional().default(false),
});

export const Hy2TlsGenerateResultSchema = z.enum([
  "generated",
  "overwritten",
  "conflict",
  "error",
]);

export const Hy2TlsGenerateResponseSchema = z.object({
  result: Hy2TlsGenerateResultSchema,
  message: z.string().optional(),
});

export type Hy2TlsGenerateRequest = z.infer<typeof Hy2TlsGenerateRequestSchema>;
export type Hy2TlsGenerateResponse = z.infer<
  typeof Hy2TlsGenerateResponseSchema
>;
