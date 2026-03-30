import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const DraftV2RayApiStatsSchema = z
  .object({
    enabled: z.boolean().optional(),
    inbounds: z.array(NonEmptyStringSchema).optional(),
    outbounds: z.array(NonEmptyStringSchema).optional(),
    users: z.array(NonEmptyStringSchema).optional(),
  })
  .optional();

export const DraftV2RayApiSchema = z
  .object({
    listen: NonEmptyStringSchema.optional(),
    stats: DraftV2RayApiStatsSchema,
  })
  .optional();

export const DraftExperimentalSchema = z
  .object({
    v2ray_api: DraftV2RayApiSchema,
  })
  .optional();

export type DraftV2RayApiStats = z.infer<typeof DraftV2RayApiStatsSchema>;
export type DraftV2RayApi = z.infer<typeof DraftV2RayApiSchema>;
export type DraftExperimental = z.infer<typeof DraftExperimentalSchema>;
