import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const Hy2UserSchema = z.object({
  display_name: z.string().trim().min(1, "Нужен user_name"),
  password: z.string().trim().min(1, "Нужен password"),
});

export const Hy2FormSchema = BaseInboundFormSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().int().min(1, "Нужен up_mbps"),
  down_mbps: z.number().int().min(1, "Нужен down_mbps"),
  ignore_client_bandwidth: z.boolean(),
  users: z.array(Hy2UserSchema).min(1, "Нужен хотя бы один пользователь"),
  obfs_enabled: z.boolean(),
  obfs_password: z.string().trim().optional(),
  _security_asset_id: z.string().trim().min(1).optional(),
}).superRefine((data, ctx) => {
  tlsValidate(data, ctx);
  usersValidate(data, ctx);
  obfsValidate(data, ctx);
  bandwidthValidate(data, ctx);
});

const obfsValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.obfs_enabled && !data.obfs_password?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["obfs_password"],
      message: "Укажите obfs password",
    });
  }
};

const tlsValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (!data._security_asset_id?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["_security_asset_id"],
      message: "Для Hysteria2 необходимо выбрать TLS asset",
    });
  }
};

const bandwidthValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (
    data.ignore_client_bandwidth &&
    (data.up_mbps !== undefined || data.down_mbps !== undefined)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["ignore_client_bandwidth"],
      message: "ignore_client_bandwidth конфликтует с up_mbps/down_mbps",
    });
  }
};

const usersValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  const seen = new Map<string, number>();
  const duplicates = new Set<number>();

  data.users.forEach((user, index) => {
    const name = user.display_name.trim().toLowerCase();

    if (!name) return;

    const firstIndex = seen.get(name);

    if (firstIndex !== undefined) {
      duplicates.add(firstIndex);
      duplicates.add(index);
      return;
    }

    seen.set(name, index);
  });

  for (const index of duplicates) {
    ctx.addIssue({
      code: "custom",
      path: ["users", index, "display_name"],
      message: "Имя пользователя должно быть уникальным",
    });
  }
};
