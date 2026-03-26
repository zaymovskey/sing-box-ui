import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

const BaseOutboundSchema = z.object({
  tag: NonEmptyStringSchema,
});

export const DirectOutboundSchema = BaseOutboundSchema.extend({
  type: z.literal("direct"),
});

export const RuntimeOutboundSchema = z.discriminatedUnion("type", [
  DirectOutboundSchema,
]);

export const DraftOutboundSchema = RuntimeOutboundSchema;

export type DirectOutbound = z.infer<typeof DirectOutboundSchema>;
export type RuntimeOutbound = z.infer<typeof RuntimeOutboundSchema>;
export type DraftOutbound = z.infer<typeof DraftOutboundSchema>;
