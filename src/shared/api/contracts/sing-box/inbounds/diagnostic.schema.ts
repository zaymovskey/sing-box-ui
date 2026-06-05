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
        reason: z.enum(["not_listening", "command_failed"]).optional(),
        port: z.number(),
      })
      .optional(),
  });

export const InboundDiagnosticSchema = z.discriminatedUnion("key", [
  InboundDiagnosticPortListeningSchema,
]);

export const InboundDiagnosticResponseSchema = z.array(InboundDiagnosticSchema);

export type InboundDiagnosticResponse = z.infer<
  typeof InboundDiagnosticResponseSchema
>;

export const InboundDiagnosticRequestSchema = z.object({
  diagnostics: z.array(DiagnosticKeySchema),
});

export type DiagnosticKey = z.infer<typeof DiagnosticKeySchema>;

export type InboundDiagnosticRequest = z.infer<
  typeof InboundDiagnosticRequestSchema
>;

export type InboundDiagnosticPortListening = z.infer<
  typeof InboundDiagnosticPortListeningSchema
>;
export type InboundDiagnostic = InboundDiagnosticPortListening;

export type DiagnosticStatus = z.infer<typeof CheckStatusSchema>;
