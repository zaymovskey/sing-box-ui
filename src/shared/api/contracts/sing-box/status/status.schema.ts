import { z } from "zod";

export const SingBoxStatusCheckSchema = z.enum([
  "container_not_running",
  "invalid_config",
  "draft_not_applied",
]);

export const SingBoxStatusSummaryScheme = z.enum(["ok", "error", "warning"]);

export const SingBoxStatusResponseSchema = z.object({
  summary: SingBoxStatusSummaryScheme,
  checks: SingBoxStatusCheckSchema.array(),
});

export type SingBoxStatusSummary = z.infer<typeof SingBoxStatusSummaryScheme>;
export type SingBoxStatusCheck = z.infer<typeof SingBoxStatusCheckSchema>;
export type SingBoxStatusResponse = z.infer<typeof SingBoxStatusResponseSchema>;
