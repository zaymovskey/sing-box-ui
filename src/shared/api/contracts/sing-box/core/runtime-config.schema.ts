import { z } from "zod";

import { RuntimeInboundSchema } from "./inbounds.schema";
import { RuntimeOutboundSchema } from "./outbounds.schema";

const LogLevelSchema = z.enum([
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "panic",
]);

export const LogSchema = z
  .object({
    disabled: z.boolean().optional(),
    level: LogLevelSchema.optional(),
    timestamp: z.boolean().optional(),
  })
  .optional();

export const RouteSchema = z
  .object({
    final: z.string().min(1).optional(),
  })
  .optional();

export const RuntimeConfigSchema = z.object({
  log: LogSchema,
  inbounds: z.array(RuntimeInboundSchema).optional(),
  outbounds: z.array(RuntimeOutboundSchema).optional(),
  route: RouteSchema,
});

export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
