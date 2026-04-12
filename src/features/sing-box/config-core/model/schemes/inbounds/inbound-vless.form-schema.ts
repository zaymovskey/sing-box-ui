import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const VlessFlowSchema = z.enum(["xtls-rprx-vision"]);
const JsonStringSchema = z.string().trim();

const VlessUserFormSchema = z.object({
  display_name: z.string().trim().min(1, "Нужен user_name"),
  uuid: z.uuid("Нужен UUID"),
  flow: VlessFlowSchema.optional(),
});

const VlessMultiplexBrutalSchema = z.object({
  enabled: z.boolean(),
  up_mbps: z.number().min(0),
  down_mbps: z.number().min(0),
});

const VlessMultiplexSchema = z.object({
  enabled: z.boolean(),
  padding: z.boolean(),
  brutal: VlessMultiplexBrutalSchema,
});

const VlessTransportWsSchema = z.object({
  type: z.literal("ws"),
  path: z.string().trim().optional(),
  headers: JsonStringSchema.optional(),
  max_early_data: z.number().int().min(0).optional(),
  early_data_header_name: z.string().trim().optional(),
});

const VlessTransportGrpcSchema = z.object({
  type: z.literal("grpc"),
  service_name: z.string().trim().min(1, "Нужен service_name"),
  idle_timeout: z.string().trim().optional(),
  ping_timeout: z.string().trim().optional(),
  permit_without_stream: z.boolean().optional(),
});

const VlessTransportHttpSchema = z.object({
  type: z.literal("http"),
  host: z.string().trim().optional(),
  path: z.string().trim().optional(),
  method: z.string().trim().optional(),
  headers: JsonStringSchema.optional(),
  idle_timeout: z.string().trim().optional(),
  ping_timeout: z.string().trim().optional(),
});

const VlessTransportHttpUpgradeSchema = z.object({
  type: z.literal("httpupgrade"),
  host: z.string().trim().optional(),
  path: z.string().trim().optional(),
  headers: JsonStringSchema.optional(),
});

const VlessTransportQuicSchema = z.object({
  type: z.literal("quic"),
});

const VlessTransportDisabledSchema = z.object({
  type: z.literal("disabled"),
});

const VlessTransportSchema = z
  .discriminatedUnion("type", [
    VlessTransportWsSchema,
    VlessTransportGrpcSchema,
    VlessTransportHttpSchema,
    VlessTransportHttpUpgradeSchema,
    VlessTransportQuicSchema,
    VlessTransportDisabledSchema,
  ])
  .superRefine((data, ctx) => {
    if ("headers" in data && data.headers) {
      validateJsonObjectString(data.headers, ctx, ["headers"]);
    }

    if (data.type === "http" && data.host) {
      const hosts = data.host
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (hosts.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["host"],
          message: "Host должен содержать хотя бы одно значение",
        });
      }
    }
  });

export const VlessFormSchema = BaseInboundFormSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserFormSchema).min(1, "Нужен хотя бы один пользователь"),
  multiplex: VlessMultiplexSchema.optional(),
  transport: VlessTransportSchema.optional(),
  _security_asset_id: z.string().trim().min(1).optional(),
  _tls_enabled: z.boolean(),
}).superRefine((data, ctx) => {
  tlsValidate(data, ctx);
  usersValidate(data, ctx);
  multiplexBrutalValidate(data, ctx);
});

const tlsValidate = (
  data: z.input<typeof VlessFormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data._tls_enabled && !data._security_asset_id?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["_security_asset_id"],
      message: "При включенном TLS необходимо выбрать TLS / Reality",
    });
  }
};

const validateJsonObjectString = (
  value: string,
  ctx: z.RefinementCtx,
  path: (string | number)[],
) => {
  try {
    const parsed = JSON.parse(value) as unknown;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      Object.values(parsed).some((item) => typeof item !== "string")
    ) {
      ctx.addIssue({
        code: "custom",
        path,
        message: 'Ожидается JSON-объект вида {"Header":"value"}',
      });
    }
  } catch {
    ctx.addIssue({
      code: "custom",
      path,
      message: "Некорректный JSON",
    });
  }
};

const usersValidate = (
  data: z.input<typeof VlessFormSchema>,
  ctx: z.RefinementCtx,
) => {
  const seen = new Map<string, number>();
  const duplicates = new Set<number>();

  data.users.forEach((user, index) => {
    const uuid = user.uuid.trim().toLowerCase();

    if (!uuid) return;

    const firstIndex = seen.get(uuid);

    if (firstIndex !== undefined) {
      duplicates.add(firstIndex);
      duplicates.add(index);
      return;
    }

    seen.set(uuid, index);
  });

  for (const index of duplicates) {
    ctx.addIssue({
      code: "custom",
      path: ["users", index, "uuid"],
      message: "UUID пользователя должен быть уникальным",
    });
  }
};

const multiplexBrutalValidate = (
  data: z.input<typeof VlessFormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.multiplex?.enabled && data.multiplex?.brutal?.enabled) {
    if (data.multiplex?.brutal?.up_mbps <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["multiplex.brutal.up_mbps"],
        message: "Multiplex brutal up must be greater than 0",
      });
    }
    if (data.multiplex?.brutal?.down_mbps <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["multiplex.brutal.down_mbps"],
        message: "Multiplex brutal down must be greater than 0",
      });
    }
  }
};
