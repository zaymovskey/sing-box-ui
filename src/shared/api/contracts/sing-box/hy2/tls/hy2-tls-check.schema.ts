import { z } from "zod";

export const Hy2TlsCheckRequestSchema = z.object({
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

export const Hy2TlsCheckResponseSchema = z.object({
  cert: Hy2TlsCheckItemSchema,
  key: Hy2TlsCheckItemSchema,
  pair: Hy2TlsCheckItemSchema,
});

export type Hy2TlsCheckRequest = z.infer<typeof Hy2TlsCheckRequestSchema>;
export type Hy2TlsCheckResponse = z.infer<typeof Hy2TlsCheckResponseSchema>;
