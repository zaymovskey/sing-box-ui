import { z } from "zod";

export const TLSFileCheckRequestSchema = z.object({
  certificatePath: z.string().trim().min(1),
  keyPath: z.string().trim().min(1),
});

export const Hy2TlsCheckItemSchema = z.enum([
  "success",
  "not_found",
  "no_access",
  "invalid",
  "mismatch",
  "skipped",
  "outside_allowed_dir",
]);

export const TLSFileCheckResponseSchema = z.object({
  cert: Hy2TlsCheckItemSchema,
  key: Hy2TlsCheckItemSchema,
  pair: Hy2TlsCheckItemSchema,
  isSelfSigned: z.boolean().nullable().optional(),
});

export type TLSCheckItem = z.infer<typeof Hy2TlsCheckItemSchema>;
export type TLSFileCheckRequest = z.infer<typeof TLSFileCheckRequestSchema>;
export type TLSFileCheckResponse = z.infer<typeof TLSFileCheckResponseSchema>;
