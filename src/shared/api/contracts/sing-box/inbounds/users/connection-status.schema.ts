import { z } from "zod";

import { StoredInboundUserSchema } from "../../core/inbounds.schema";

const InternalTagSchema = z.string().min(1);

export const InboundUserConnectionStatusUserItem = z.object({
  user: StoredInboundUserSchema,
  connected: z.boolean(),
});

export const InboundUserConnectionStatusItem = z.object({
  inboundTag: InternalTagSchema,
  users: InboundUserConnectionStatusUserItem.array(),
});

export const InboundUserConnectionStatusResponseSchema = z.object({
  inbounds: InboundUserConnectionStatusItem.array(),
});

export type InboundUserConnectionStatusResponse = z.infer<
  typeof InboundUserConnectionStatusResponseSchema
>;
