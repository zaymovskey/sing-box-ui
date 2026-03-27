import z from "zod";

import { DraftInboundSchema } from "../core/inbounds.schema";

export const InboundsListResponseSchema = z.object({
  list: DraftInboundSchema.array(),
});

export type InboundsListResponse = z.infer<typeof InboundsListResponseSchema>;
