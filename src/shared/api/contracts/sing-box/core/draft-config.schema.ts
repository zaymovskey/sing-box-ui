import { z } from "zod";

import { DraftInboundSchema } from "./inbounds.schema";
import { DraftOutboundSchema } from "./outbounds.schema";

export const DraftLogSchema = z
  .object({
    disabled: z.boolean().optional(),
    level: z.string().optional(),
    timestamp: z.boolean().optional(),
  })
  .optional();

export const DraftRouteSchema = z
  .object({
    final: z.string().optional(),
  })
  .optional();

export const DraftConfigSchema = z.object({
  log: DraftLogSchema,
  inbounds: z.array(DraftInboundSchema).optional(),
  outbounds: z.array(DraftOutboundSchema).optional(),
  route: DraftRouteSchema,
});

export type DraftConfig = z.infer<typeof DraftConfigSchema>;
