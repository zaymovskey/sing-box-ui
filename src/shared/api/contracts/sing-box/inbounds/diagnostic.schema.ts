import { z } from "zod";

const CheckStatusSchema = z.enum(["pass", "warn", "error", "unknown"]);

const CheckSourceSchema = z.enum(["live", "snapshot"]);

const DiagnosticKeySchema = z.enum(["port_listening"]);

export const InboundDiagnosticBaseSchema = z.object({
  key: DiagnosticKeySchema,
  title: z.string(),
  status: CheckStatusSchema,
  message: z.string(),
  checkedAt: z.string().nullable(),
  source: CheckSourceSchema,
});

export const InboundDiagnosticPortListeningSchema =
  InboundDiagnosticBaseSchema.extend({
    details: z
      .object({
        summary: z.enum(["ok", "error"]),
        reason: z.enum(["not_listening", "command_failed"]).optional(),
      })
      .optional(),
  });

export const InboundDiagnosticSchema = z.discriminatedUnion("key", [
  InboundDiagnosticPortListeningSchema,
]);

export const InboundDiagnosticRequestSchema = z.object({
  diagnostics: z.array(DiagnosticKeySchema),
});

export type InboundDiagnosticRequest = z.infer<
  typeof InboundDiagnosticRequestSchema
>;

export type InboundDiagnosticPortListening = z.infer<
  typeof InboundDiagnosticPortListeningSchema
>;
export type InboundDiagnostic = InboundDiagnosticPortListening;
