import z from "zod";

import { BaseInboundFormSchema } from "./inbound-base.form-schema";

const Hy2UserSchema = z.object({
  display_name: z.string().trim().min(1, "Нужен user_name"),
  password: z.string().trim().min(1, "Нужен password"),
});

const Hy2MasqueradeSchema = z.object({
  type: z.enum([
    "disabled",
    "url",
    "file_server",
    "reverse_proxy",
    "fixed_response",
  ]),

  // URL mode
  url_string: z.string().trim().optional(),

  // File server
  directory: z.string().trim().optional(),

  // Reverse proxy
  url: z.string().trim().optional(),
  rewrite_host: z.boolean().optional(),

  // Fixed respons
  status_code: z.number().int().optional(),
  headers: z.string().trim().optional(),
  content: z.string().trim().optional(),
});

export const Hy2FormSchema = BaseInboundFormSchema.extend({
  type: z.literal("hysteria2"),
  up_mbps: z.number().int().min(1, "Нужен up_mbps").optional(),
  down_mbps: z.number().int().min(1, "Нужен down_mbps").optional(),
  ignore_client_bandwidth: z.boolean(),
  users: z.array(Hy2UserSchema).min(1, "Нужен хотя бы один пользователь"),
  obfs_enabled: z.boolean(),
  obfs_password: z.string().trim().optional(),
  _security_asset_id: z.string().trim().min(1).optional(),
  masquerade: Hy2MasqueradeSchema,
}).superRefine((data, ctx) => {
  tlsValidate(data, ctx);
  usersValidate(data, ctx);
  obfsValidate(data, ctx);
  bandwidthValidate(data, ctx);
  masqueradeValidate(data, ctx);
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

const bandwidthValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.ignore_client_bandwidth) {
    return;
  }

  if (data.up_mbps === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["up_mbps"],
      message: "Укажите up_mbps",
    });
  }

  if (data.down_mbps === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["down_mbps"],
      message: "Укажите down_mbps",
    });
  }
};

const masqueradeValidate = (
  data: z.input<typeof Hy2FormSchema>,
  ctx: z.RefinementCtx,
) => {
  const masquerade = data.masquerade;

  if (masquerade.type === "disabled") {
    return;
  }

  if (masquerade.type === "url") {
    const value = masquerade.url_string?.trim();

    if (!value) {
      ctx.addIssue({
        code: "custom",
        path: ["masquerade", "url_string"],
        message: "Укажите URL для masquerade",
      });
      return;
    }

    if (!/^(https?:\/\/|file:\/\/)/i.test(value)) {
      ctx.addIssue({
        code: "custom",
        path: ["masquerade", "url_string"],
        message: "URL должен начинаться с http://, https:// или file://",
      });
    }

    return;
  }

  if (masquerade.type === "file_server") {
    if (!masquerade.directory?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["masquerade", "directory"],
        message: "Укажите directory для file server",
      });
    }

    return;
  }

  if (masquerade.type === "reverse_proxy") {
    const value = masquerade.url?.trim();

    if (!value) {
      ctx.addIssue({
        code: "custom",
        path: ["masquerade", "url"],
        message: "Укажите URL для reverse proxy",
      });
      return;
    }

    if (!/^https?:\/\//i.test(value)) {
      ctx.addIssue({
        code: "custom",
        path: ["masquerade", "url"],
        message: "URL reverse proxy должен начинаться с http:// или https://",
      });
    }

    return;
  }

  if (masquerade.status_code === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["masquerade", "status_code"],
      message: "Укажите status code",
    });
    return;
  }

  if (masquerade.status_code < 100 || masquerade.status_code > 599) {
    ctx.addIssue({
      code: "custom",
      path: ["masquerade", "status_code"],
      message: "Status code должен быть в диапазоне 100-599",
    });
  }

  const headersText = masquerade.headers?.trim();

  if (!headersText) {
    return;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(headersText);
  } catch {
    ctx.addIssue({
      code: "custom",
      path: ["masquerade", "headers"],
      message: "Headers должен быть валидным JSON",
    });
    return;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    ctx.addIssue({
      code: "custom",
      path: ["masquerade", "headers"],
      message: "Headers должен быть JSON-объектом",
    });
  }
};

export type Hy2Form = z.infer<typeof Hy2FormSchema>;
