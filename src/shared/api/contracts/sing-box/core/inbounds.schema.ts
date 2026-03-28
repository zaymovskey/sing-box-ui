import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

const ListenSchema = z.string().min(1);
const ListenPortSchema = z.number().int().min(0).max(65535);
const SniffSchema = z.boolean().optional();
const SniffOverrideDestinationSchema = z.boolean().optional();

export const BaseInboundSchema = z.object({
  tag: NonEmptyStringSchema.optional(),
  listen: ListenSchema.optional(),
  listen_port: ListenPortSchema.optional(),
  sniff: SniffSchema,
  sniff_override_destination: SniffOverrideDestinationSchema,
});

export const VlessUserSchema = z.object({
  name: NonEmptyStringSchema.optional(),
  uuid: NonEmptyStringSchema,
  flow: z.string().optional(),
});

export const Hysteria2UserSchema = z.object({
  name: NonEmptyStringSchema.optional(),
  password: NonEmptyStringSchema,
});

export const VlessRealityHandshakeSchema = z.object({
  server: NonEmptyStringSchema,
  server_port: ListenPortSchema.optional(),
});

export const RuntimeVlessRealitySchema = z.object({
  enabled: z.boolean().optional(),
  handshake: VlessRealityHandshakeSchema.optional(),
  private_key: z.string().optional(),
  short_id: z.union([z.string(), z.array(z.string())]).optional(),
});

export const DraftVlessRealitySchema = RuntimeVlessRealitySchema.extend({
  _reality_public_key: z.string().optional(),
});

export const RuntimeVlessTlsSchema = z.object({
  enabled: z.boolean().optional(),
  server_name: z.string().optional(),
  reality: RuntimeVlessRealitySchema.optional(),
});

export const DraftVlessTlsSchema = RuntimeVlessTlsSchema.extend({
  reality: DraftVlessRealitySchema.optional(),
});

export const RuntimeVlessInboundSchema = BaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserSchema).optional(),
  tls: RuntimeVlessTlsSchema.optional(),
});

export const DraftVlessInboundSchema = BaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserSchema).optional(),
  tls: DraftVlessTlsSchema.optional(),
});

export const Hysteria2ObfsSchema = z.object({
  type: z.string().optional(),
  password: z.string().optional(),
});

export const RuntimeHysteria2TlsSchema = z.object({
  enabled: z.boolean().optional(),
  server_name: z.string().optional(),
  certificate_path: z.string().optional(),
  key_path: z.string().optional(),
});

export const DraftHysteria2TlsSchema = RuntimeHysteria2TlsSchema.extend({
  _is_selfsigned_cert: z.boolean().optional(),
});

export const RuntimeHysteria2InboundSchema = BaseInboundSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().nonnegative().optional(),
  down_mbps: z.number().nonnegative().optional(),
  users: z.array(Hysteria2UserSchema).optional(),
  tls: RuntimeHysteria2TlsSchema.optional(),
  obfs: Hysteria2ObfsSchema.optional(),
});

export const DraftHysteria2InboundSchema = BaseInboundSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().nonnegative().optional(),
  down_mbps: z.number().nonnegative().optional(),
  users: z.array(Hysteria2UserSchema).optional(),
  tls: DraftHysteria2TlsSchema.optional(),
  obfs: Hysteria2ObfsSchema.optional(),
});

export const RuntimeInboundSchema = z.discriminatedUnion("type", [
  RuntimeVlessInboundSchema,
  RuntimeHysteria2InboundSchema,
]);

export const DraftInboundSchema = z.discriminatedUnion("type", [
  DraftVlessInboundSchema,
  DraftHysteria2InboundSchema,
]);

export const DraftInboundUserSchema = z.union([
  VlessUserSchema,
  Hysteria2UserSchema,
]);

export type Hysteria2User = z.infer<typeof Hysteria2UserSchema>;
export type VlessUser = z.infer<typeof VlessUserSchema>;

export type DraftInboundUser = z.infer<typeof DraftInboundUserSchema>;

export type RuntimeVlessInbound = z.infer<typeof RuntimeVlessInboundSchema>;
export type DraftVlessInbound = z.infer<typeof DraftVlessInboundSchema>;
export type RuntimeHysteria2Inbound = z.infer<
  typeof RuntimeHysteria2InboundSchema
>;
export type DraftHysteria2Inbound = z.infer<typeof DraftHysteria2InboundSchema>;

export type RuntimeInbound = z.infer<typeof RuntimeInboundSchema>;
export type DraftInbound = z.infer<typeof DraftInboundSchema>;
