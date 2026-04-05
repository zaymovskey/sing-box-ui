import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const VlessFlowSchema = z.enum(["xtls-rprx-vision"]);

const VlessUserFormSchema = z.object({
  display_name: z.string().trim().min(1, "Нужен user_name"),
  uuid: z.uuid("Нужен UUID"),
  flow: VlessFlowSchema.optional(),
});

export const VlessFormSchema = BaseInboundFormSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserFormSchema).min(1, "Нужен хотя бы один пользователь"),
  _security_asset_id: z.string().trim().min(1).optional(),
  _tls_enabled: z.boolean(),
}).superRefine((data, ctx) => {
  tlsValidate(data, ctx);
  usersValidate(data, ctx);
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
