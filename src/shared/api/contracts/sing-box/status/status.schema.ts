import { z } from "zod";

export const SingBoxStatusSummarySchema = z.enum(["ok", "error", "warning"]);

const SingBoxStatusCheckCodeSchema = z.enum([
  "container_not_running",
  "invalid_config",
  "draft_not_applied",
]);

const SingBoxStatusCheckSchema = z.object({
  code: SingBoxStatusCheckCodeSchema,
  message: z.string(),
});

export const SingBoxStatusResponseSchema = z.object({
  summary: SingBoxStatusSummarySchema,
  checks: z.array(SingBoxStatusCheckSchema),
});

export type SingBoxStatusCheckCode = z.infer<
  typeof SingBoxStatusCheckCodeSchema
>;
export type SingBoxStatusSummary = z.infer<typeof SingBoxStatusSummarySchema>;
export type SingBoxStatusCheck = z.infer<typeof SingBoxStatusCheckSchema>;
export type SingBoxStatusResponse = z.infer<typeof SingBoxStatusResponseSchema>;
