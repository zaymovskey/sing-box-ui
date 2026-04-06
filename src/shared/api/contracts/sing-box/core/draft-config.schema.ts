import { z } from "zod";

import { DraftExperimentalSchema } from "./experimental.schema";
import { StoredInboundSchema } from "./inbounds.schema";
import { DraftOutboundSchema } from "./outbounds.schema";

const LogLevelSchema = z.enum([
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "panic",
]);

export const DraftLogSchema = z
  .object({
    disabled: z.boolean().optional(),
    level: LogLevelSchema.optional(),
    timestamp: z.boolean().optional(),
  })
  .optional();

export const DraftRouteSchema = z
  .object({
    final: z.string().min(1).optional(),
  })
  .optional();

export const DraftConfigSchema = z.object({
  log: DraftLogSchema,
  inbounds: z.array(StoredInboundSchema).optional(),
  outbounds: z.array(DraftOutboundSchema).optional(),
  route: DraftRouteSchema,
  experimental: DraftExperimentalSchema,
});

export type DraftConfig = z.infer<typeof DraftConfigSchema>;
