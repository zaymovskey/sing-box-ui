import z from "zod";

import {
  BaseInboundSchema,
  DraftInboundUserSchema,
} from "../../core/inbounds.schema";

export const InboundUserConnectionStatusUserItem = z.object({
  user: DraftInboundUserSchema,
  connected: z.boolean(),
});

export const InboundUserConntectionStatusItem = z.object({
  inboundTag: BaseInboundSchema.shape.tag,
  users: InboundUserConnectionStatusUserItem.array(),
});

export const InboundUserConntectionStatusResponseSchema = z.object({
  inbounds: InboundUserConntectionStatusItem.array(),
});

export type InboundUserConntectionStatusResponse = z.infer<
  typeof InboundUserConntectionStatusResponseSchema
>;
