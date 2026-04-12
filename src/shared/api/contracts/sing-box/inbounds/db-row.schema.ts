import { z } from "zod";

const DbIdSchema = z.string().min(1);
const DbTimestampSchema = z.iso.datetime();

const NullableStringSchema = z.string().nullable();
const NullableNumberSchema = z.number().nullable();

/**
 * SQLite boolean обычно лежит как 0 / 1
 */
const SqliteBooleanSchema = z.union([z.literal(0), z.literal(1)]);
const NullableSqliteBooleanSchema = SqliteBooleanSchema.nullable();

export const InboundDbTypeSchema = z.enum(["vless", "hysteria2"]);
export type InboundDbType = z.infer<typeof InboundDbTypeSchema>;

export const InboundUserKindSchema = z.enum(["vless", "hysteria2"]);
export type InboundUserKind = z.infer<typeof InboundUserKindSchema>;

/**
 * inbounds
 */
export const InboundRowSchema = z.object({
  id: DbIdSchema,
  display_tag: NullableStringSchema,
  internal_tag: NullableStringSchema,
  type: InboundDbTypeSchema,

  listen: NullableStringSchema,
  listen_port: NullableNumberSchema,
  sniff: NullableSqliteBooleanSchema,
  sniff_override_destination: NullableSqliteBooleanSchema,

  security_asset_id: NullableStringSchema,

  created_at: DbTimestampSchema,
  updated_at: DbTimestampSchema,
});

export const InboundRowsSchema = z.array(InboundRowSchema);

export type InboundRow = z.infer<typeof InboundRowSchema>;
export type InboundRows = z.infer<typeof InboundRowsSchema>;

/**
 * inbound_vless
 */
export const InboundVlessRowSchema = z.object({
  inbound_id: DbIdSchema,
  tls_enabled: NullableSqliteBooleanSchema,
  reality_public_key: NullableStringSchema,
  multiplex_enabled: NullableSqliteBooleanSchema,
  multiplex_padding: NullableSqliteBooleanSchema,
  multiplex_brutal_enabled: NullableSqliteBooleanSchema,
  multiplex_brutal_up_mbps: NullableNumberSchema,
  multiplex_brutal_down_mbps: NullableNumberSchema,
});

export const InboundVlessRowsSchema = z.array(InboundVlessRowSchema);

export type InboundVlessRow = z.infer<typeof InboundVlessRowSchema>;
export type InboundVlessRows = z.infer<typeof InboundVlessRowsSchema>;

/**
 * inbound_hysteria2
 */
export const InboundHysteria2RowSchema = z.object({
  inbound_id: DbIdSchema,

  up_mbps: NullableNumberSchema,
  down_mbps: NullableNumberSchema,
  ignore_client_bandwidth: NullableSqliteBooleanSchema,

  obfs_type: NullableStringSchema,
  obfs_password: NullableStringSchema,

  masquerade_json: NullableStringSchema,

  bbr_profile: NullableStringSchema,
  brutal_debug: NullableSqliteBooleanSchema,
});

export const InboundHysteria2RowsSchema = z.array(InboundHysteria2RowSchema);

export type InboundHysteria2Row = z.infer<typeof InboundHysteria2RowSchema>;
export type InboundHysteria2Rows = z.infer<typeof InboundHysteria2RowsSchema>;

/**
 * inbound_users
 */
export const InboundUserRowSchema = z.object({
  id: DbIdSchema,
  inbound_id: DbIdSchema,
  kind: InboundUserKindSchema,
  sort_order: z.number().int().nonnegative(),

  internal_name: NullableStringSchema,
  display_name: NullableStringSchema,

  uuid: NullableStringSchema,
  flow: NullableStringSchema,

  password: NullableStringSchema,

  up_traffic_total: z.number().int().nonnegative(),
  down_traffic_total: z.number().int().nonnegative(),

  last_seen_up_counter: z.number().int().nonnegative(),
  last_seen_down_counter: z.number().int().nonnegative(),

  last_up_traffic_at: z.iso.datetime().nullable(),
  last_down_traffic_at: z.iso.datetime().nullable(),
});

export const InboundUserRowsSchema = z.array(InboundUserRowSchema);

export type InboundUserRow = z.infer<typeof InboundUserRowSchema>;
export type InboundUserRows = z.infer<typeof InboundUserRowsSchema>;
