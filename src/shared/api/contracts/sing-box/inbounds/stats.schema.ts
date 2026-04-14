import { z } from "zod";

const TrafficAmountSchema = z.number().nonnegative();

const NullableDateTimeSchema = z.iso.datetime().nullable();

export const InboundUserStatsSchema = z.object({
  id: z.string(),
  inbound_id: z.string(),

  internal_name: z.string(),
  display_name: z.string(),

  up_traffic_total: TrafficAmountSchema,
  down_traffic_total: TrafficAmountSchema,

  last_seen_up_counter: TrafficAmountSchema,
  last_seen_down_counter: TrafficAmountSchema,

  last_up_traffic_at: NullableDateTimeSchema,
  last_down_traffic_at: NullableDateTimeSchema,

  is_online: z.boolean(),
});

export const InboundStatsSchema = z.object({
  id: z.string(),
  type: z.enum(["vless", "hysteria2"]),

  display_tag: z.string(),
  internal_tag: z.string(),

  listen: z.string().nullable(),
  listen_port: z.number().int().positive(),

  users: z.array(InboundUserStatsSchema),

  up_traffic_total: TrafficAmountSchema,
  down_traffic_total: TrafficAmountSchema,

  online_users_count: z.number().int().nonnegative(),
});

export const InboundsStatsResponseSchema = z.object({
  items: z.array(InboundStatsSchema),
});

export type InboundUserStats = z.infer<typeof InboundUserStatsSchema>;
export type InboundStats = z.infer<typeof InboundStatsSchema>;
export type InboundsStatsResponse = z.infer<typeof InboundsStatsResponseSchema>;
