import { z } from "zod";

export const NonEmptyStringSchema = z.string().min(1);

export const ListenSchema = z.string().min(1);
export const ListenPortSchema = z
  .number()
  .positive()
  .min(1, "Минимум 1")
  .max(65535, "Максимум 65535");

export const SniffSchema = z.boolean().optional();
export const SniffOverrideDestinationSchema = z.boolean().optional();

export const SingBoxBaseInboundSchema = z.object({
  tag: NonEmptyStringSchema,
  listen: ListenSchema.optional(),
  listen_port: ListenPortSchema.optional(),
  sniff: SniffSchema,
  sniff_override_destination: SniffOverrideDestinationSchema,
});

export const VlessFlowSchema = z.enum(["xtls-rprx-vision"]);

export const SingBoxVlessUserSchema = z.object({
  name: NonEmptyStringSchema,
  uuid: NonEmptyStringSchema,
  flow: VlessFlowSchema.optional(),
});

export const SingBoxHysteria2UserSchema = z.object({
  name: NonEmptyStringSchema,
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

export const SingBoxVlessTlsSchema = z.object({
  enabled: z.boolean().optional(),
  server_name: z.string().optional(),
  reality: SingBoxVlessRealitySchema.optional(),
});

const HeaderObjectSchema = z.record(z.string(), z.string());

const HostSchema = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
]);

export const SingBoxV2RayTransportSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ws"),
    path: z.string().optional(),
    headers: HeaderObjectSchema.optional(),
    max_early_data: z.number().int().nonnegative().optional(),
    early_data_header_name: z.string().optional(),
  }),
  z.object({
    type: z.literal("grpc"),
    service_name: NonEmptyStringSchema,
    idle_timeout: z.string().optional(),
    ping_timeout: z.string().optional(),
    permit_without_stream: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("http"),
    host: HostSchema.optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    headers: HeaderObjectSchema.optional(),
    idle_timeout: z.string().optional(),
    ping_timeout: z.string().optional(),
  }),
  z.object({
    type: z.literal("httpupgrade"),
    host: NonEmptyStringSchema.optional(),
    path: z.string().optional(),
    headers: HeaderObjectSchema.optional(),
  }),
  z.object({
    type: z.literal("quic"),
  }),
]);

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

export const Hysteria2BandwidthSchema = z.number().nonnegative();

export const Hysteria2MasqueradeSchema = z.union([
  z.string(),
  z.object({
    type: z.string().optional(),
    file: z.string().optional(),
    directory: z.string().optional(),
    url: z.string().optional(),
  }),
]);

export function addHysteria2CrossFieldValidation(
  data: {
    ignore_client_bandwidth?: boolean;
    up_mbps?: number;
    down_mbps?: number;
    obfs?: { type?: "salamander"; password?: string };
  },
  ctx: z.RefinementCtx,
) {
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
}

const SingBoxVlessMultiplexBrutalSchema = z.object({
  enabled: z.boolean(),
  up_mbps: z.number().min(0),
  down_mbps: z.number().min(0),
});

const SingBoxVlessMultiplexSchema = z.object({
  enabled: z.boolean(),
  padding: z.boolean(),
  brutal: SingBoxVlessMultiplexBrutalSchema,
});

export const SingBoxVlessInboundSchema = SingBoxBaseInboundSchema.extend({
  type: z.literal("vless"),
  users: z.array(SingBoxVlessUserSchema).min(1),
  tls: SingBoxVlessTlsSchema.optional(),
  multiplex: SingBoxVlessMultiplexSchema.optional(),
  transport: SingBoxV2RayTransportSchema.optional(),
});

export const SingBoxHysteria2InboundSchema = SingBoxBaseInboundSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: Hysteria2BandwidthSchema.optional(),
  down_mbps: Hysteria2BandwidthSchema.optional(),
  ignore_client_bandwidth: z.boolean().optional(),
  users: z.array(SingBoxHysteria2UserSchema).min(1),
  obfs: Hysteria2ObfsSchema.optional(),
  tls: SingBoxHysteria2TlsSchema.optional(),
  masquerade: Hysteria2MasqueradeSchema.optional(),
  bbr_profile: z.string().optional(),
  brutal_debug: z.boolean().optional(),
}).superRefine(addHysteria2CrossFieldValidation);

export const SingBoxInboundSchema = z.discriminatedUnion("type", [
  SingBoxVlessInboundSchema,
  SingBoxHysteria2InboundSchema,
]);

export type SingBoxVlessUser = z.infer<typeof SingBoxVlessUserSchema>;
export type SingBoxHysteria2User = z.infer<typeof SingBoxHysteria2UserSchema>;

export type SingBoxVlessReality = z.infer<typeof SingBoxVlessRealitySchema>;
export type SingBoxVlessTls = z.infer<typeof SingBoxVlessTlsSchema>;
export type SingBoxV2RayTransport = z.infer<typeof SingBoxV2RayTransportSchema>;

export type SingBoxHysteria2Tls = z.infer<typeof SingBoxHysteria2TlsSchema>;

export type SingBoxVlessInbound = z.infer<typeof SingBoxVlessInboundSchema>;
export type SingBoxHysteria2Inbound = z.infer<
  typeof SingBoxHysteria2InboundSchema
>;

export type SingBoxInbound = z.infer<typeof SingBoxInboundSchema>;
