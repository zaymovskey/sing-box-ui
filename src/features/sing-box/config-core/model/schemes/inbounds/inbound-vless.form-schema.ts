import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const VlessUserSchema = z.object({
  name: z.string().trim().min(1, "Нужен user_name"),
  uuid: z.uuid("Нужен UUID"),
  flow: z.string().trim().optional(),
});

export const VlessFormSchema = BaseInboundFormSchema.extend({
  type: z.literal("vless"),

  tls_enabled: z.boolean(),
  reality_enabled: z.boolean(),

  tls_server_name: z.string().trim().optional(),
  reality_handshake_server: z.string().trim().optional(),
  reality_handshake_server_port: z.number().int().min(1).max(65535).optional(),
  reality_private_key: z.string().trim().optional(),
  _reality_public_key: z.string().trim().optional(),

  users: z.array(VlessUserSchema).min(1, "Нужен хотя бы один пользователь"),
}).superRefine((data, ctx) => {
  tlsValidate(data, ctx);
  usersValidate(data, ctx);
});

const tlsValidate = (
  data: z.input<typeof VlessFormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.tls_enabled) {
    if (!data.tls_server_name) {
      ctx.addIssue({
        code: "custom",
        path: ["tls_server_name"],
        message: "Нужен TLS server name",
      });
    }
  }

  if (data.reality_enabled) {
    if (!data.tls_enabled) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_enabled"],
        message: "Reality требует включенного TLS",
      });
    }

    if (!data.reality_handshake_server) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_handshake_server"],
        message: "Нужен handshake server",
      });
    }

    if (data.reality_handshake_server_port == null) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_handshake_server_port"],
        message: "Нужен handshake server port",
      });
    }

    if (!data.reality_private_key) {
      ctx.addIssue({
        code: "custom",
        path: ["reality_private_key"],
        message: "Необходимо сгенерировать пару ключей",
      });
    }

    if (!data._reality_public_key) {
      ctx.addIssue({
        code: "custom",
        path: ["_reality_public_key"],
        message: "Необходимо сгенерировать пару ключей",
      });
    }
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
      message: "Имя пользователя должно быть уникальным",
    });
  }
};
