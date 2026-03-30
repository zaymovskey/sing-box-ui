import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const Hy2UserSchema = z.object({
  name: z.string().trim().min(1, "Нужен user_name"),
  password: z.string().trim().min(1, "Нужен password"),
});

export const Hy2FormSchema = BaseInboundFormSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().int().min(1),
  down_mbps: z.number().int().min(1),
  users: z.array(Hy2UserSchema).min(1, "Нужен хотя бы один пользователь"),
}).superRefine((data, ctx) => {
  usersValidate(data, ctx);
});

const usersValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  const seen = new Map<string, number>();
  const duplicates = new Set<number>();

  data.users.forEach((user, index) => {
    const name = user.name.trim().toLowerCase();

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
      path: ["users", index, "name"],
      message: "Имя пользователя должно быть уникальным",
    });
  }
};
