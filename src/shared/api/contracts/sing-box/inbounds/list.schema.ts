import z from "zod";

import {
  addHysteria2CrossFieldValidation,
  Hysteria2BandwidthSchema,
  Hysteria2MasqueradeSchema,
  Hysteria2ObfsSchema,
} from "../core/inbounds.schema";
import { SaveBaseInboundSchema, StoredBaseInboundSchema } from "./base.schema";
import { StoredHysteria2TlsSchema, StoredVlessTlsSchema } from "./tls.schema";
import {
  Hysteria2UserSchema,
  SaveHysteria2UserSchema,
  SaveVlessUserSchema,
  VlessUserSchema,
} from "./users.schema";

export type InboundsListResponse = z.infer<typeof InboundsListResponseSchema>;

export const StoredVlessInboundSchema = StoredBaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserSchema).min(1),
  tls: StoredVlessTlsSchema.optional(),
  _security_asset_id: z.string().optional(),
  _tls_enabled: z.boolean().optional(),
});

export const SaveVlessInboundSchema = SaveBaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(SaveVlessUserSchema).min(1),
  tls: StoredVlessTlsSchema.optional(),
  _security_asset_id: z.string().optional(),
  _tls_enabled: z.boolean().optional(),
});

export const StoredHysteria2InboundSchema = StoredBaseInboundSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: Hysteria2BandwidthSchema.optional(),
  down_mbps: Hysteria2BandwidthSchema.optional(),
  ignore_client_bandwidth: z.boolean().optional(),
  users: z.array(Hysteria2UserSchema).min(1),
  obfs: Hysteria2ObfsSchema.optional(),
  tls: StoredHysteria2TlsSchema.optional(),
  masquerade: Hysteria2MasqueradeSchema.optional(),
  bbr_profile: z.string().optional(),
  brutal_debug: z.boolean().optional(),
  _security_asset_id: z.string().optional(),
}).superRefine(addHysteria2CrossFieldValidation);

export const SaveHysteria2InboundSchema = SaveBaseInboundSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: Hysteria2BandwidthSchema.optional(),
  down_mbps: Hysteria2BandwidthSchema.optional(),
  ignore_client_bandwidth: z.boolean().optional(),
  users: z.array(SaveHysteria2UserSchema).min(1),
  obfs: Hysteria2ObfsSchema.optional(),
  tls: StoredHysteria2TlsSchema.optional(),
  masquerade: Hysteria2MasqueradeSchema.optional(),
  bbr_profile: z.string().optional(),
  brutal_debug: z.boolean().optional(),
  _security_asset_id: z.string().optional(),
}).superRefine(addHysteria2CrossFieldValidation);

export const StoredInboundSchema = z.discriminatedUnion("type", [
  StoredVlessInboundSchema,
  StoredHysteria2InboundSchema,
]);

export const SaveInboundInputSchema = z.discriminatedUnion("type", [
  SaveVlessInboundSchema,
  SaveHysteria2InboundSchema,
]);

export const InboundsListResponseSchema = z.object({
  list: StoredInboundSchema.array(),
});

export type StoredVlessInbound = z.infer<typeof StoredVlessInboundSchema>;
export type SaveVlessInbound = z.infer<typeof SaveVlessInboundSchema>;

export type StoredHysteria2Inbound = z.infer<
  typeof StoredHysteria2InboundSchema
>;
export type SaveHysteria2Inbound = z.infer<typeof SaveHysteria2InboundSchema>;

export type StoredInbound = z.infer<typeof StoredInboundSchema>;
export type SaveInboundInput = z.infer<typeof SaveInboundInputSchema>;
