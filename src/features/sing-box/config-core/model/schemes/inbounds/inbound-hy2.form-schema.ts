import z from "zod";

import { hasExtension } from "../../../lib/inbounds/hy2/hy2-tls-path.utils";
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
  tls_enabled: z.boolean(),
  tls_server_name: z.string().trim().optional(),
  key_path: z.string().trim().optional(),
  certificate_path: z.string().trim().optional(),
  _tlsChecked: z.boolean().optional().default(false),
  _tlsOverwrite: z.boolean().default(false),
}).superRefine((data, ctx) => {
  tlsValidate(data, ctx);
  usersValidate(data, ctx);
});

const tlsValidate = (
  data: z.input<typeof Hy2FormSchema>,
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

    if (!data.certificate_path) {
      ctx.addIssue({
        code: "custom",
        path: ["certificate_path"],
        message: "Нужен путь к .crt",
      });
    } else {
      if (!hasExtension(data.certificate_path, ".crt")) {
        ctx.addIssue({
          code: "custom",
          path: ["certificate_path"],
          message: "Файл сертификата должен иметь расширение .crt",
        });
      }
    }

    if (!data.key_path) {
      ctx.addIssue({
        code: "custom",
        path: ["key_path"],
        message: "Нужен путь к .key",
      });
    } else {
      if (!hasExtension(data.key_path, ".key")) {
        ctx.addIssue({
          code: "custom",
          path: ["key_path"],
          message: "Файл ключа должен иметь расширение .key",
        });
      }
    }

    if (data._tlsChecked !== true) {
      ctx.addIssue({
        code: "custom",
        path: ["_tlsChecked"],
        message: "Сначала проверьте TLS сертификат и ключ",
      });
    }
  }
};

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
