import z from "zod";

import { StoredInboundSchema } from "../core/inbounds.schema";

export const InboundsListResponseSchema = z.object({
  list: StoredInboundSchema.array(),
});

export type InboundsListResponse = z.infer<typeof InboundsListResponseSchema>;
