import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const VlessUserSchema = z.object({
  name: z.string().trim().min(1, "Нужен user_name"),
  uuid: z.uuid("Нужен UUID"),
  flow: z.string().trim().optional(),
});

export const VlessFormSchema = BaseInboundFormSchema.extend({
  type: z.literal("vless"),
  users: z.array(VlessUserSchema).min(1, "Нужен хотя бы один пользователь"),
}).superRefine((data, ctx) => {
  usersValidate(data, ctx);
});

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
