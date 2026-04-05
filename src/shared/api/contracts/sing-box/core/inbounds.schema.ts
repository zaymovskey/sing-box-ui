import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

const ListenSchema = z.string().min(1);
const ListenPortSchema = z
  .number()
  .positive()
  .min(1, "Минимум 1")
  .max(65535, "Максимум 65535");

const SniffSchema = z.boolean().optional();
const SniffOverrideDestinationSchema = z.boolean().optional();

export const BaseInboundSchema = z.object({
  tag: NonEmptyStringSchema.optional(),
  listen: ListenSchema.optional(),
  listen_port: ListenPortSchema.optional(),
  sniff: SniffSchema,
  sniff_override_destination: SniffOverrideDestinationSchema,
});

const VlessFlowSchema = z.enum(["xtls-rprx-vision"]);

export const VlessUserSchema = z.object({
  name: NonEmptyStringSchema.optional(),
  uuid: NonEmptyStringSchema,
  flow: VlessFlowSchema.optional(),
});

export const Hysteria2UserSchema = z.object({
  name: NonEmptyStringSchema.optional(),
  password: NonEmptyStringSchema,
});

export const VlessRealityHandshakeSchema = z.object({
  server: NonEmptyStringSchema,
  server_port: ListenPortSchema,
});

const ShortIdSchema = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
]);

export const SingBoxVlessRealitySchema = z
  .object({
    enabled: z.boolean().optional(),
    handshake: VlessRealityHandshakeSchema.optional(),
    private_key: z.string().optional(),
    short_id: ShortIdSchema.optional(),
    max_time_difference: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enabled !== true) {
      return;
    }

    if (!data.handshake) {
      ctx.addIssue({
        code: "custom",
        path: ["handshake"],
        message: "Reality handshake is required when reality is enabled",
      });
    }

    if (!data.private_key) {
      ctx.addIssue({
        code: "custom",
        path: ["private_key"],
        message: "Reality private_key is required when reality is enabled",
      });
    }

    if (!data.short_id) {
      ctx.addIssue({
        code: "custom",
        path: ["short_id"],
        message: "Reality short_id is required when reality is enabled",
      });
    }
  });

export const StoredVlessRealitySchema = SingBoxVlessRealitySchema.extend({
  _reality_public_key: z.string().optional(),
});

export const SingBoxVlessTlsSchema = z.object({
  enabled: z.boolean().optional(),
  server_name: z.string().optional(),
  reality: SingBoxVlessRealitySchema.optional(),
});

export const StoredVlessTlsSchema = SingBoxVlessTlsSchema.extend({
  reality: StoredVlessRealitySchema.optional(),
});

export const Hysteria2ObfsSchema = z.object({
  type: z.literal("salamander").optional(),
  password: z.string().optional(),
});

export const SingBoxHysteria2TlsSchema = z.object({
  enabled: z.boolean().optional(),
  server_name: z.string().optional(),
  certificate: z.string().optional(),
  key: z.string().optional(),
  certificate_path: z.string().optional(),
  key_path: z.string().optional(),
});

export const StoredHysteria2TlsSchema = SingBoxHysteria2TlsSchema;

export const SingBoxVlessInboundSchema = BaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserSchema).min(1),
  tls: SingBoxVlessTlsSchema.optional(),
});

export const StoredVlessInboundSchema = BaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserSchema).min(1),
  tls: StoredVlessTlsSchema.optional(),
  _security_asset_id: z.string().optional(),
  _tls_enabled: z.boolean().optional(),
});

const Hysteria2BandwidthSchema = z.number().nonnegative();

const Hysteria2MasqueradeSchema = z.union([
  z.string(),
  z.object({
    type: z.string().optional(),
    file: z.string().optional(),
    directory: z.string().optional(),
    url: z.string().optional(),
  }),
]);

export const SingBoxHysteria2InboundSchema = BaseInboundSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: Hysteria2BandwidthSchema.optional(),
  down_mbps: Hysteria2BandwidthSchema.optional(),
  ignore_client_bandwidth: z.boolean().optional(),
  users: z.array(Hysteria2UserSchema).min(1),
  obfs: Hysteria2ObfsSchema.optional(),
  tls: SingBoxHysteria2TlsSchema,
  masquerade: Hysteria2MasqueradeSchema.optional(),
  bbr_profile: z.string().optional(),
  brutal_debug: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (
    data.ignore_client_bandwidth === true &&
    (data.up_mbps !== undefined || data.down_mbps !== undefined)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["ignore_client_bandwidth"],
      message: "ignore_client_bandwidth conflicts with up_mbps/down_mbps",
    });
  }

  if (data.obfs?.password && !data.obfs.type) {
    ctx.addIssue({
      code: "custom",
      path: ["obfs", "type"],
      message: "Obfs type is required when obfs password is set",
    });
  }
});

export const StoredHysteria2InboundSchema = BaseInboundSchema.extend({
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
}).superRefine((data, ctx) => {
  if (
    data.ignore_client_bandwidth === true &&
    (data.up_mbps !== undefined || data.down_mbps !== undefined)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["ignore_client_bandwidth"],
      message: "ignore_client_bandwidth conflicts with up_mbps/down_mbps",
    });
  }

  if (data.obfs?.password && !data.obfs.type) {
    ctx.addIssue({
      code: "custom",
      path: ["obfs", "type"],
      message: "Obfs type is required when obfs password is set",
    });
  }
});

export const SingBoxInboundSchema = z.discriminatedUnion("type", [
  SingBoxVlessInboundSchema,
  SingBoxHysteria2InboundSchema,
]);

export const StoredInboundSchema = z.discriminatedUnion("type", [
  StoredVlessInboundSchema,
  StoredHysteria2InboundSchema,
]);

export const StoredInboundUserSchema = z.union([
  VlessUserSchema,
  Hysteria2UserSchema,
]);

export type Hysteria2User = z.infer<typeof Hysteria2UserSchema>;
export type VlessUser = z.infer<typeof VlessUserSchema>;

export type StoredInboundUser = z.infer<typeof StoredInboundUserSchema>;

export type SingBoxVlessReality = z.infer<typeof SingBoxVlessRealitySchema>;
export type StoredVlessReality = z.infer<typeof StoredVlessRealitySchema>;
export type SingBoxVlessTls = z.infer<typeof SingBoxVlessTlsSchema>;
export type StoredVlessTls = z.infer<typeof StoredVlessTlsSchema>;
export type SingBoxHysteria2Tls = z.infer<typeof SingBoxHysteria2TlsSchema>;
export type StoredHysteria2Tls = z.infer<typeof StoredHysteria2TlsSchema>;

export type SingBoxVlessInbound = z.infer<typeof SingBoxVlessInboundSchema>;
export type StoredVlessInbound = z.infer<typeof StoredVlessInboundSchema>;
export type SingBoxHysteria2Inbound = z.infer<
  typeof SingBoxHysteria2InboundSchema
>;
export type StoredHysteria2Inbound = z.infer<
  typeof StoredHysteria2InboundSchema
>;

export type SingBoxInbound = z.infer<typeof SingBoxInboundSchema>;
export type StoredInbound = z.infer<typeof StoredInboundSchema>;
