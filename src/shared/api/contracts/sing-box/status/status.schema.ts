import { z } from "zod";

export const SingBoxStatusSchema = z.enum(["running", "error"]);

export const SingBoxStatusReasonSchema = z.enum([
  "ok",
  "container_not_running",
  "invalid_config",
  "service_unreachable",
  "draft_not_applied",
]);

export const SingBoxStatusResponseSchema = z.object({
  status: SingBoxStatusSchema,
  reason: SingBoxStatusReasonSchema,
});

export type SingBoxStatusReason = z.infer<typeof SingBoxStatusReasonSchema>;
export type SingBoxStatus = z.infer<typeof SingBoxStatusSchema>;
export type SingBoxStatusResponse = z.infer<typeof SingBoxStatusResponseSchema>;
